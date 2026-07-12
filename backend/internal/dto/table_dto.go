package dto

type TableResponse struct {
	ID          uint   `json:"id"`
	TableNumber string `json:"table_number"`
	IsActive    bool   `json:"is_active"`
}
