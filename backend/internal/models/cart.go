package models

type Cart struct {
	ID     uint       `gorm:"primaryKey" json:"id"`
	UserID uint       `gorm:"not null" json:"user_id"`
	Items  []CartItem `gorm:"foreignKey:CartID" json:"items,omitempty"`
}

type CartItem struct {
	ID        uint             `gorm:"primaryKey" json:"id"`
	CartID    uint             `gorm:"not null" json:"cart_id"`
	ProductID uint             `gorm:"not null" json:"product_id"`
	Product   Product          `json:"product,omitempty"`
	Quantity  int              `gorm:"not null;default:1" json:"quantity"`
	Note      string           `gorm:"size:255" json:"note,omitempty"`
	Options   []CartItemOption `gorm:"foreignKey:CartItemID" json:"options,omitempty"`
}

type CartItemOption struct {
	ID            uint               `gorm:"primaryKey" json:"id"`
	CartItemID    uint               `gorm:"not null" json:"cart_item_id"`
	OptionValueID uint               `gorm:"not null" json:"option_value_id"`
	OptionValue   ProductOptionValue `json:"option_value,omitempty"`
}
