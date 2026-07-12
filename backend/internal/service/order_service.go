package service

import (
	"errors"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/models"
	"VerdantBrew/backend/internal/repository"

	"gorm.io/gorm"
)

type OrderService struct {
	OrderRepo      *repository.OrderRepository
	CartRepo       *repository.CartRepository
	TableRepo      *repository.TableRepository
	UserRepo       *repository.UserRepository
	AddressRepo    *repository.AddressRepository
	VoucherService *VoucherService
	PaymentService *PaymentService
}

func NewOrderService(
	orderRepo *repository.OrderRepository,
	cartRepo *repository.CartRepository,
	tableRepo *repository.TableRepository,
	userRepo *repository.UserRepository,
	addressRepo *repository.AddressRepository,
	voucherService *VoucherService,
	paymentService *PaymentService,
) *OrderService {
	return &OrderService{
		OrderRepo:      orderRepo,
		CartRepo:       cartRepo,
		TableRepo:      tableRepo,
		UserRepo:       userRepo,
		AddressRepo:    addressRepo,
		VoucherService: voucherService,
		PaymentService: paymentService,
	}
}

func (s *OrderService) Checkout(userID uint, req dto.CheckoutRequest) (*dto.OrderResponse, error) {
	// 1. Validasi order type
	if req.OrderType != "dine_in" && req.OrderType != "takeaway" && req.OrderType != "delivery" {
		return nil, errors.New("order_type tidak valid")
	}
	if req.OrderType == "dine_in" && req.TableID == nil {
		return nil, errors.New("table_id wajib diisi untuk dine-in")
	}

	// Validasi & ambil snapshot alamat (khusus delivery)
	var deliveryAddressSnapshot string
	if req.OrderType == "delivery" {
		if req.AddressID == nil {
			return nil, errors.New("address_id wajib diisi untuk delivery")
		}
		address, err := s.AddressRepo.FindByID(*req.AddressID)
		if err != nil || address.UserID != userID {
			return nil, errors.New("alamat tidak ditemukan")
		}
		deliveryAddressSnapshot = address.RecipientName + " (" + address.Phone + ") - " +
			address.FullAddress + ", " + address.City + " " + address.PostalCode
	}

	// 2. Ambil isi cart
	cart, err := s.CartRepo.GetOrCreateCart(userID)
	if err != nil {
		return nil, err
	}
	cartWithItems, err := s.CartRepo.GetCartWithItems(cart.ID)
	if err != nil {
		return nil, err
	}
	if len(cartWithItems.Items) == 0 {
		return nil, errors.New("keranjang belanja kosong")
	}

	// 3. Validasi meja (kalau dine-in)
	if req.OrderType == "dine_in" {
		if _, err := s.TableRepo.FindByID(*req.TableID); err != nil {
			return nil, errors.New("meja tidak ditemukan")
		}
	}

	// 4. Hitung subtotal dari cart
	var subtotal float64
	for _, item := range cartWithItems.Items {
		var extraPriceTotal float64
		for _, opt := range item.Options {
			extraPriceTotal += opt.OptionValue.ExtraPrice
		}
		subtotal += (item.Product.Price + extraPriceTotal) * float64(item.Quantity)
	}

	// 5. Hitung diskon voucher (kalau ada)
	var voucherDiscount float64
	var voucherID uint
	if req.VoucherCode != "" {
		voucherResult, err := s.VoucherService.ValidateVoucher(dto.ValidateVoucherRequest{
			Code:     req.VoucherCode,
			Subtotal: subtotal,
		})
		if err != nil {
			return nil, err
		}
		voucherDiscount = voucherResult.DiscountAmount
		voucherID = voucherResult.ID
	}

	afterVoucher := subtotal - voucherDiscount

	// 6. Hitung diskon poin (kalau dipakai)
	var pointsDiscount float64
	if req.PointsToRedeem > 0 {
		user, err := s.UserRepo.FindByID(userID)
		if err != nil {
			return nil, err
		}
		if req.PointsToRedeem > user.PointsBalance {
			return nil, errors.New("poin tidak mencukupi")
		}

		pointsDiscount = float64(req.PointsToRedeem) * 100 // 1 poin = Rp100
		if pointsDiscount > afterVoucher {
			return nil, errors.New("poin yang digunakan melebihi total pembayaran")
		}
	}

	total := afterVoucher - pointsDiscount
	estimatedPointsEarned := int(total * 0.03)

	var createdOrder models.Order

	// 7. Jalankan semua operasi tulis dalam 1 transaction
	err = s.OrderRepo.WithTransaction(func(tx *gorm.DB) error {
		order := models.Order{
			OrderCode:               s.OrderRepo.GenerateOrderCode(),
			UserID:                  userID,
			TableID:                 req.TableID,
			OrderType:               req.OrderType,
			Status:                  "pending",
			Subtotal:                subtotal,
			Discount:                voucherDiscount + pointsDiscount,
			Total:                   total,
			AddressID:               req.AddressID,
			DeliveryAddressSnapshot: deliveryAddressSnapshot,
			EstimatedTimeMinutes:    15,
		}

		// Bangun order items dari cart items (snapshot harga saat ini)
		for _, item := range cartWithItems.Items {
			orderItem := models.OrderItem{
				ProductID:           item.ProductID,
				ProductNameSnapshot: item.Product.Name,
				PriceSnapshot:       item.Product.Price,
				Quantity:            item.Quantity,
				Note:                item.Note,
			}
			for _, opt := range item.Options {
				orderItem.Options = append(orderItem.Options, models.OrderItemOption{
					OptionLabelSnapshot: opt.OptionValue.Label,
					ExtraPriceSnapshot:  opt.OptionValue.ExtraPrice,
				})
			}
			order.Items = append(order.Items, orderItem)
		}

		// Nested create: Order + OrderItems + OrderItemOptions sekaligus
		if err := s.OrderRepo.CreateOrder(tx, &order); err != nil {
			return err
		}

		// Catat penggunaan voucher (kalau ada)
		if voucherID != 0 {
			ov := models.OrderVoucher{
				OrderID:         order.ID,
				VoucherID:       voucherID,
				DiscountApplied: voucherDiscount,
			}
			if err := s.OrderRepo.CreateOrderVoucher(tx, &ov); err != nil {
				return err
			}
		}

		// Catat penukaran poin & kurangi saldo (kalau dipakai)
		if req.PointsToRedeem > 0 {
			pt := models.PointTransaction{
				UserID:      userID,
				OrderID:     &order.ID,
				Type:        "redeem",
				Points:      -req.PointsToRedeem,
				Description: "Penukaran poin saat checkout " + order.OrderCode,
			}
			if err := s.OrderRepo.CreatePointTransaction(tx, &pt); err != nil {
				return err
			}
			if err := s.OrderRepo.UpdateUserPoints(tx, userID, -req.PointsToRedeem); err != nil {
				return err
			}
		}

		// Buat record payment (status masih pending, integrasi gateway di tahap berikutnya)
		payment := models.Payment{
			OrderID: order.ID,
			Method:  req.PaymentMethod,
			Status:  "pending",
			Amount:  total,
		}
		if err := tx.Create(&payment).Error; err != nil {
			return err
		}

		// Kosongkan cart setelah order berhasil dibuat
		if err := s.CartRepo.ClearUserCartTx(tx, userID); err != nil {
			return err
		}

		createdOrder = order
		return nil
	})

	if err != nil {
		return nil, err
	}

	// Panggil Midtrans untuk generate URL pembayaran (di luar transaction database)
	userData, _ := s.UserRepo.FindByID(userID)
	createdOrder.User = *userData

	paymentURL, err := s.PaymentService.CreateSnapTransaction(&createdOrder)
	if err != nil {
		// Order tetap dianggap berhasil dibuat, tapi kasih tahu ada masalah di payment URL
		paymentURL = ""
	}

	return &dto.OrderResponse{
		ID:                    createdOrder.ID,
		OrderCode:             createdOrder.OrderCode,
		Status:                createdOrder.Status,
		OrderType:             createdOrder.OrderType,
		Subtotal:              subtotal,
		VoucherDiscount:       voucherDiscount,
		PointsDiscount:        pointsDiscount,
		Total:                 total,
		EstimatedTimeMinutes:  createdOrder.EstimatedTimeMinutes,
		EstimatedPointsEarned: estimatedPointsEarned,
		CreatedAt:             createdOrder.CreatedAt,
		PaymentURL:            paymentURL,
	}, nil
}
