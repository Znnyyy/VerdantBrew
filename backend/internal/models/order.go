package models

import "time"

type Order struct {
	ID                      uint        `gorm:"primaryKey" json:"id"`
	OrderCode               string      `gorm:"size:30;unique;not null" json:"order_code"`
	UserID                  uint        `gorm:"not null" json:"user_id"`
	User                    User        `json:"user,omitempty"`
	TableID                 *uint       `json:"table_id,omitempty"`
	AddressID               *uint       `json:"address_id,omitempty"` // referensi ke alamat asli (bisa null kalau alamat dihapus)
	Table                   *Table      `json:"table,omitempty"`
	OrderType               string      `gorm:"size:20;not null" json:"order_type"`
	Status                  string      `gorm:"size:20;default:pending" json:"status"`
	Subtotal                float64     `gorm:"not null" json:"subtotal"`
	Discount                float64     `gorm:"default:0" json:"discount"`
	Total                   float64     `gorm:"not null" json:"total"`
	DeliveryAddressSnapshot string      `gorm:"type:text" json:"delivery_address_snapshot,omitempty"` // teks lengkap saat checkout
	EstimatedTimeMinutes    int         `json:"estimated_time_minutes"`
	Items                   []OrderItem `json:"items,omitempty"`
	CreatedAt               time.Time   `json:"created_at"`
	UpdatedAt               time.Time   `json:"updated_at"`
}
