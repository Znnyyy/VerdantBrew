package models

import "time"

type Voucher struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Code           string    `gorm:"size:30;unique;not null" json:"code"`
	DiscountType   string    `gorm:"size:20;not null" json:"discount_type"`
	DiscountValue  float64   `gorm:"not null" json:"discount_value"`
	MinOrderAmount float64   `gorm:"default:0" json:"min_order_amount"`
	ValidFrom      time.Time `json:"valid_from"`
	ValidUntil     time.Time `json:"valid_until"`
	UsageLimit     int       `json:"usage_limit"`
	IsActive       bool      `gorm:"default:true" json:"is_active"`
}
