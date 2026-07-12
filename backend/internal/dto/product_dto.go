package dto

type OptionValueResponse struct {
	ID         uint    `json:"id"`
	Label      string  `json:"label"`
	ExtraPrice float64 `json:"extra_price"`
}

type OptionGroupResponse struct {
	ID            uint                  `json:"id"`
	Name          string                `json:"name"`
	SelectionType string                `json:"selection_type"`
	IsRequired    bool                  `json:"is_required"`
	Values        []OptionValueResponse `json:"values"`
}

// buat list produk
type ProductListResponse struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"image_url"`
	IsAvailable bool    `json:"is_available"`
}

// buat detail produk
type ProductDetailResponse struct {
	ID           uint                  `json:"id"`
	Name         string                `json:"name"`
	Description  string                `json:"description"`
	Price        float64               `json:"price"`
	ImageURL     string                `json:"image_url"`
	IsAvailable  bool                  `json:"is_available"`
	CategoryName string                `json:"category_name"`
	OptionGroups []OptionGroupResponse `json:"option_groups"`
}

type CategoryResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}
