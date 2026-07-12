package models

type ProductOptionValue struct {
	ID            uint    `gorm:"primaryKey" json:"id"`
	OptionGroupID uint    `gorm:"not null" json:"option_group_id"`
	Label         string  `gorm:"size:50;not null" json:"label"`
	ExtraPrice    float64 `gorm:"default:0" json:"extra_price"`
	SortOrder     int     `gorm:"default:0" json:"sort_order"`
}
