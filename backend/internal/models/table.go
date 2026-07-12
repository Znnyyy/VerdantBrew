package models

type Table struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	TableNumber string `gorm:"size:20;not null" json:"table_number"` // "TABLE 12"
	QRCodeToken string `gorm:"size:100;unique;not null" json:"qr_code_token"`
	IsActive    bool   `gorm:"default:true" json:"is_active"`
}
