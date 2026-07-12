package dto

type AddCartItemRequest struct {
	ProductID      uint   `json:"product_id" validate:"required"`
	Quantity       int    `json:"quantity" validate:"required,min=1"`
	Note           string `json:"note"`
	OptionValueIDs []uint `json:"option_value_ids"` // ID dari ProductOptionValue yang dipilih user
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" validate:"required,min=1"`
}

type CartItemOptionResponse struct {
	ID         uint    `json:"id"`
	Label      string  `json:"label"`
	ExtraPrice float64 `json:"extra_price"`
}

type CartItemResponse struct {
	ID          uint                     `json:"id"`
	ProductID   uint                     `json:"product_id"`
	ProductName string                   `json:"product_name"`
	ImageURL    string                   `json:"image_url"`
	BasePrice   float64                  `json:"base_price"`
	Quantity    int                      `json:"quantity"`
	Note        string                   `json:"note"`
	Options     []CartItemOptionResponse `json:"options"`
	ItemTotal   float64                  `json:"item_total"` // (base_price + total extra) * quantity
}

type CartResponse struct {
	ID         uint               `json:"id"`
	Items      []CartItemResponse `json:"items"`
	Subtotal   float64            `json:"subtotal"`
	TotalItems int                `json:"total_items"`
}
