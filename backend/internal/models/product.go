package models

type Product struct {
	ID           uint                 `gorm:"primaryKey" json:"id"`
	CategoryID   uint                 `gorm:"not null" json:"category_id"`
	Category     Category             `json:"category,omitempty"`
	Name         string               `gorm:"size:100;not null" json:"name"`
	Slug         string               `gorm:"size:100;unique;not null" json:"slug"`
	Description  string               `gorm:"type:text" json:"description"`
	Price        float64              `gorm:"not null" json:"price"`
	ImageURL     string               `gorm:"size:255" json:"image_url"`
	IsAvailable  bool                 `gorm:"default:true" json:"is_available"`
	OptionGroups []ProductOptionGroup `json:"option_groups,omitempty"`
}
