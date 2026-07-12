package models

type OrderItem struct {
	ID                  uint              `gorm:"primaryKey" json:"id"`
	OrderID             uint              `gorm:"not null" json:"order_id"`
	ProductID           uint              `gorm:"not null" json:"product_id"`
	Product             Product           `json:"product,omitempty"`
	ProductNameSnapshot string            `gorm:"size:100;not null" json:"product_name_snapshot"`
	PriceSnapshot       float64           `gorm:"not null" json:"price_snapshot"`
	Quantity            int               `gorm:"not null;default:1" json:"quantity"`
	Note                string            `gorm:"size:255" json:"note,omitempty"`
	Options             []OrderItemOption `json:"options,omitempty"`
}
