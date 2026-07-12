package models

type Address struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	UserID        uint   `gorm:"not null" json:"user_id"`
	Label         string `gorm:"size:50;not null" json:"label"`
	RecipientName string `gorm:"size:100;not null" json:"recipient_name"`
	Phone         string `gorm:"size:20;not null" json:"phone"`
	FullAddress   string `gorm:"type:text;not null" json:"full_address"`
	City          string `gorm:"size:100" json:"city"`
	PostalCode    string `gorm:"size:10" json:"postal_code"`
	IsPrimary     bool   `gorm:"default:false" json:"is_primary"`
}
