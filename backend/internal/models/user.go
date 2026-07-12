package models

import "time"

type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	FullName      string    `gorm:"size:100;not null" json:"full_name"`
	Email         string    `gorm:"size:100;unique;not null" json:"email"`
	Phone         string    `gorm:"size:20" json:"phone"`
	PasswordHash  string    `gorm:"not null" json:"-"`
	Provider      string    `gorm:"size:20;default:local" json:"provider"`
	ProviderID    string    `gorm:"size:100" json:"-"`
	PointsBalance int       `gorm:"default:0" json:"points_balance"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
