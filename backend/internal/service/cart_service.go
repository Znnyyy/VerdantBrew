package service

import (
	"errors"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/models"
	"VerdantBrew/backend/internal/repository"
)

type CartService struct {
	CartRepo    *repository.CartRepository
	ProductRepo *repository.ProductRepository
}

func NewCartService(cartRepo *repository.CartRepository, productRepo *repository.ProductRepository) *CartService {
	return &CartService{CartRepo: cartRepo, ProductRepo: productRepo}
}

func (s *CartService) AddItem(userID uint, req dto.AddCartItemRequest) error {
	cart, err := s.CartRepo.GetOrCreateCart(userID)
	if err != nil {
		return err
	}

	// Pastikan produk yang mau ditambahkan memang ada
	product, err := s.ProductRepo.FindByID(req.ProductID)
	if err != nil {
		return errors.New("produk tidak ditemukan")
	}
	if !product.IsAvailable {
		return errors.New("produk sedang tidak tersedia")
	}

	item := models.CartItem{
		CartID:    cart.ID,
		ProductID: req.ProductID,
		Quantity:  req.Quantity,
		Note:      req.Note,
	}

	// Siapkan opsi yang dipilih user (kalau ada)
	for _, optionValueID := range req.OptionValueIDs {
		item.Options = append(item.Options, models.CartItemOption{
			OptionValueID: optionValueID,
		})
	}

	// GORM otomatis insert item + options-nya sekaligus (nested create, sama kayak seeder)
	return s.CartRepo.AddItem(&item)
}

func (s *CartService) GetCart(userID uint) (*dto.CartResponse, error) {
	cart, err := s.CartRepo.GetOrCreateCart(userID)
	if err != nil {
		return nil, err
	}

	cartWithItems, err := s.CartRepo.GetCartWithItems(cart.ID)
	if err != nil {
		return nil, err
	}

	var itemResponses []dto.CartItemResponse
	var subtotal float64
	totalItems := 0

	for _, item := range cartWithItems.Items {
		var optionResponses []dto.CartItemOptionResponse
		var extraPriceTotal float64

		for _, opt := range item.Options {
			optionResponses = append(optionResponses, dto.CartItemOptionResponse{
				ID:         opt.OptionValue.ID,
				Label:      opt.OptionValue.Label,
				ExtraPrice: opt.OptionValue.ExtraPrice,
			})
			extraPriceTotal += opt.OptionValue.ExtraPrice
		}

		itemTotal := (item.Product.Price + extraPriceTotal) * float64(item.Quantity)
		subtotal += itemTotal
		totalItems += item.Quantity

		itemResponses = append(itemResponses, dto.CartItemResponse{
			ID:          item.ID,
			ProductID:   item.ProductID,
			ProductName: item.Product.Name,
			ImageURL:    item.Product.ImageURL,
			BasePrice:   item.Product.Price,
			Quantity:    item.Quantity,
			Note:        item.Note,
			Options:     optionResponses,
			ItemTotal:   itemTotal,
		})
	}

	return &dto.CartResponse{
		ID:         cartWithItems.ID,
		Items:      itemResponses,
		Subtotal:   subtotal,
		TotalItems: totalItems,
	}, nil
}

func (s *CartService) UpdateItemQuantity(itemID uint, quantity int) error {
	return s.CartRepo.UpdateItemQuantity(itemID, quantity)
}

func (s *CartService) DeleteItem(itemID uint) error {
	return s.CartRepo.DeleteItem(itemID)
}