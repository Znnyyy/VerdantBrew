package dto

import "time"

type CheckoutRequest struct {
	OrderType       string `json:"order_type" validate:"required"` // dine_in | takeaway | delivery
	TableID         *uint  `json:"table_id,omitempty"`
	DeliveryAddress string `json:"delivery_address,omitempty"`
	PaymentMethod   string `json:"payment_method" validate:"required"` // qris | cash
	VoucherCode     string `json:"voucher_code,omitempty"`
	PointsToRedeem  int    `json:"points_to_redeem,omitempty"`
}

type OrderResponse struct {
	ID                    uint      `json:"id"`
	OrderCode             string    `json:"order_code"`
	Status                string    `json:"status"`
	OrderType             string    `json:"order_type"`
	Subtotal              float64   `json:"subtotal"`
	VoucherDiscount       float64   `json:"voucher_discount"`
	PointsDiscount        float64   `json:"points_discount"`
	Total                 float64   `json:"total"`
	EstimatedTimeMinutes  int       `json:"estimated_time_minutes"`
	EstimatedPointsEarned int       `json:"estimated_points_earned"`
	CreatedAt             time.Time `json:"created_at"`
}
