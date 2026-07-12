package dto

type CreateAddressRequest struct {
	Label         string `json:"label" validate:"required"`
	RecipientName string `json:"recipient_name" validate:"required"`
	Phone         string `json:"phone" validate:"required"`
	FullAddress   string `json:"full_address" validate:"required"`
	City          string `json:"city"`
	PostalCode    string `json:"postal_code"`
	IsPrimary     bool   `json:"is_primary"`
}

type AddressResponse struct {
	ID            uint   `json:"id"`
	Label         string `json:"label"`
	RecipientName string `json:"recipient_name"`
	Phone         string `json:"phone"`
	FullAddress   string `json:"full_address"`
	City          string `json:"city"`
	PostalCode    string `json:"postal_code"`
	IsPrimary     bool   `json:"is_primary"`
}
