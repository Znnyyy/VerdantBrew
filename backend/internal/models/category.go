package models

type Category struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:50;not null" json:"name"`
	Slug      string    `gorm:"size:50;unique;not null" json:"slug"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	Products  []Product `json:"products,omitempty"`
}
