package repository

import (
	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type PaymentRepository struct {
	DB *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{DB: db}
}

func (r *PaymentRepository) FindByOrderID(orderID uint) (*models.Payment, error) {
	var payment models.Payment
	err := r.DB.Where("order_id = ?", orderID).First(&payment).Error
	if err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *PaymentRepository) UpdateStatus(paymentID uint, status string, providerRef string) error {
	updates := map[string]interface{}{
		"status": status,
	}
	if providerRef != "" {
		updates["provider_ref"] = providerRef
	}
	if status == "success" {
		updates["paid_at"] = gorm.Expr("NOW()")
	}
	return r.DB.Model(&models.Payment{}).Where("id = ?", paymentID).Updates(updates).Error
}

func (r *PaymentRepository) FindByOrderCode(orderCode string) (*models.Order, *models.Payment, error) {
	var order models.Order
	if err := r.DB.Where("order_code = ?", orderCode).First(&order).Error; err != nil {
		return nil, nil, err
	}

	var payment models.Payment
	if err := r.DB.Where("order_id = ?", order.ID).First(&payment).Error; err != nil {
		return nil, nil, err
	}

	return &order, &payment, nil
}

func (r *PaymentRepository) UpdateOrderStatus(orderID uint, status string) error {
	return r.DB.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status).Error
}
