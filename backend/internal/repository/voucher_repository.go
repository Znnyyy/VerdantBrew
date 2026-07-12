package repository

import (
	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type VoucherRepository struct {
	DB *gorm.DB
}

func NewVoucherRepository(db *gorm.DB) *VoucherRepository {
	return &VoucherRepository{DB: db}
}

func (r *VoucherRepository) FindByCode(code string) (*models.Voucher, error) {
	var voucher models.Voucher
	err := r.DB.Where("code = ? AND is_active = ?", code, true).First(&voucher).Error
	if err != nil {
		return nil, err
	}
	return &voucher, nil
}

func (r *VoucherRepository) CountUsageByVoucherID(voucherID uint) (int64, error) {
	var count int64
	err := r.DB.Model(&models.OrderVoucher{}).Where("voucher_id = ?", voucherID).Count(&count).Error
	return count, err
}
