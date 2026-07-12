package models

import "time"

type Payment struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	OrderID     uint       `gorm:"not null" json:"order_id"`
	Method      string     `gorm:"size:20;not null" json:"method"`
	Status      string     `gorm:"size:20;default:pending" json:"status"`
	Amount      float64    `gorm:"not null" json:"amount"`
	PaidAt      *time.Time `json:"paid_at,omitempty"`
	ProviderRef string     `gorm:"size:100" json:"provider_ref,omitempty"`
}
