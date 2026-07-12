package models

import "time"

type PointTransaction struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	OrderID     *uint     `json:"order_id,omitempty"`           // pointer, nullable
	Type        string    `gorm:"size:20;not null" json:"type"` // "earn" | "redeem"
	Points      int       `gorm:"not null" json:"points"`       // earn: positif, redeem: negatif
	Description string    `gorm:"size:255" json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}
