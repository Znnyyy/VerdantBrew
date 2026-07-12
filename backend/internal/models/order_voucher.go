package models

type OrderVoucher struct {
	ID              uint    `gorm:"primaryKey" json:"id"`
	OrderID         uint    `gorm:"not null" json:"order_id"`
	VoucherID       uint    `gorm:"not null" json:"voucher_id"`
	DiscountApplied float64 `gorm:"not null" json:"discount_applied"`
}
