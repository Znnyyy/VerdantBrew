package models

type OrderItemOption struct {
	ID                  uint    `gorm:"primaryKey" json:"id"`
	OrderItemID         uint    `gorm:"not null" json:"order_item_id"`
	OptionLabelSnapshot string  `gorm:"size:50;not null" json:"option_label_snapshot"`
	ExtraPriceSnapshot  float64 `gorm:"default:0" json:"extra_price_snapshot"`
}
