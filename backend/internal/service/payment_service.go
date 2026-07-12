package service

import (
	"strconv"

	"VerdantBrew/backend/internal/config"
	"VerdantBrew/backend/internal/models"
	"VerdantBrew/backend/internal/repository"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

type PaymentService struct {
	PaymentRepo *repository.PaymentRepository
	OrderRepo   *repository.OrderRepository
}

func NewPaymentService(paymentRepo *repository.PaymentRepository, orderRepo *repository.OrderRepository) *PaymentService {
	return &PaymentService{PaymentRepo: paymentRepo, OrderRepo: orderRepo}
}

// CreateSnapTransaction bikin transaksi di Midtrans, balikin URL pembayaran
func (s *PaymentService) CreateSnapTransaction(order *models.Order) (string, error) {
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  order.OrderCode,
			GrossAmt: int64(order.Total),
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: order.User.FullName,
			Email: order.User.Email,
			Phone: order.User.Phone,
		},
	}

	snapResp, err := config.SnapClient.CreateTransaction(req)
	if err != nil {
		return "", err
	}

	return snapResp.RedirectURL, nil
}

// HandleNotification memproses webhook dari Midtrans
func (s *PaymentService) HandleNotification(payload map[string]interface{}) error {
	orderCode, _ := payload["order_id"].(string)
	transactionStatus, _ := payload["transaction_status"].(string)
	fraudStatus, _ := payload["fraud_status"].(string)

	order, payment, err := s.PaymentRepo.FindByOrderCode(orderCode)
	if err != nil {
		return err
	}

	var newStatus string
	switch transactionStatus {
	case "capture":
		if fraudStatus == "accept" {
			newStatus = "success"
		} else {
			newStatus = "failed"
		}
	case "settlement":
		newStatus = "success"
	case "deny", "cancel", "expire":
		newStatus = "failed"
	case "pending":
		newStatus = "pending"
	default:
		newStatus = "pending"
	}

	if err := s.PaymentRepo.UpdateStatus(payment.ID, newStatus, orderCode); err != nil {
		return err
	}

	switch newStatus {
	case "success":
		if err := s.PaymentRepo.UpdateOrderStatus(order.ID, "preparing"); err != nil {
			return err
		}
		// Beri poin ke user - baru dilakukan di sini, setelah pembayaran benar-benar sukses
		pointsEarned := int(order.Total * 0.03)
		if pointsEarned > 0 {
			pt := models.PointTransaction{
				UserID:      order.UserID,
				OrderID:     &order.ID,
				Type:        "earn",
				Points:      pointsEarned,
				Description: "Poin dari order " + order.OrderCode,
			}
			s.OrderRepo.CreatePointTransaction(s.PaymentRepo.DB, &pt)
			s.OrderRepo.UpdateUserPoints(s.PaymentRepo.DB, order.UserID, pointsEarned)
		}
	case "failed":
		s.PaymentRepo.UpdateOrderStatus(order.ID, "cancelled")
	}

	return nil
}

func ParseGrossAmount(s string) int64 {
	amount, _ := strconv.ParseFloat(s, 64)
	return int64(amount)
}
