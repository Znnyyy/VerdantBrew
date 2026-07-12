package dto

type ValidateVoucherRequest struct {
	Code     string  `json:"code" validate:"required"`
	Subtotal float64 `json:"subtotal" validate:"required"`
}

type VoucherResponse struct {
	ID             uint    `json:"id"`
	Code           string  `json:"code"`
	DiscountType   string  `json:"discount_type"`
	DiscountValue  float64 `json:"discount_value"`
	DiscountAmount float64 `json:"discount_amount"` // nominal rupiah setelah dihitung dari subtotal
}
