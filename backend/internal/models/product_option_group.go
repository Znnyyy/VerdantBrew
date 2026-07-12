package models

type ProductOptionGroup struct {
	ID            uint                 `gorm:"primaryKey" json:"id"`
	ProductID     uint                 `gorm:"not null" json:"product_id"`
	Name          string               `gorm:"size:50;not null" json:"name"`
	SelectionType string               `gorm:"size:20;not null" json:"selection_type"`
	IsRequired    bool                 `gorm:"default:false" json:"is_required"`
	SortOrder     int                  `gorm:"default:0" json:"sort_order"`
	Values        []ProductOptionValue `gorm:"foreignKey:OptionGroupID" json:"values,omitempty"`
}
