package service

import (
	"errors"
	"time"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/repository"
)

type VoucherService struct {
	VoucherRepo *repository.VoucherRepository
}

func NewVoucherService(voucherRepo *repository.VoucherRepository) *VoucherService {
	return &VoucherService{VoucherRepo: voucherRepo}
}

func (s *VoucherService) ValidateVoucher(req dto.ValidateVoucherRequest) (*dto.VoucherResponse, error) {
	voucher, err := s.VoucherRepo.FindByCode(req.Code)
	if err != nil {
		return nil, errors.New("kode voucher tidak ditemukan")
	}

	now := time.Now()
	if now.Before(voucher.ValidFrom) || now.After(voucher.ValidUntil) {
		return nil, errors.New("voucher sudah tidak berlaku")
	}

	if req.Subtotal < voucher.MinOrderAmount {
		return nil, errors.New("belum memenuhi minimum pembelian untuk voucher ini")
	}

	if voucher.UsageLimit > 0 {
		usageCount, err := s.VoucherRepo.CountUsageByVoucherID(voucher.ID)
		if err != nil {
			return nil, err
		}
		if usageCount >= int64(voucher.UsageLimit) {
			return nil, errors.New("kuota penggunaan voucher sudah habis")
		}
	}

	discountAmount := s.calculateDiscount(voucher.DiscountType, voucher.DiscountValue, req.Subtotal)

	return &dto.VoucherResponse{
		ID:             voucher.ID,
		Code:           voucher.Code,
		DiscountType:   voucher.DiscountType,
		DiscountValue:  voucher.DiscountValue,
		DiscountAmount: discountAmount,
	}, nil
}

func (s *VoucherService) calculateDiscount(discountType string, discountValue float64, subtotal float64) float64 {
	if discountType == "percentage" {
		return subtotal * (discountValue / 100)
	}
	// discountType == "fixed"
	if discountValue > subtotal {
		return subtotal // gak boleh diskon melebihi subtotal
	}
	return discountValue
}

func (s *VoucherService) GetVoucherIDByCode(code string) (uint, error) {
	voucher, err := s.VoucherRepo.FindByCode(code)
	if err != nil {
		return 0, err
	}
	return voucher.ID, nil
}
