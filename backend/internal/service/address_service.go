package service

import (
	"errors"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/models"
	"VerdantBrew/backend/internal/repository"
)

type AddressService struct {
	AddressRepo *repository.AddressRepository
}

func NewAddressService(addressRepo *repository.AddressRepository) *AddressService {
	return &AddressService{AddressRepo: addressRepo}
}

func (s *AddressService) Create(userID uint, req dto.CreateAddressRequest) (*dto.AddressResponse, error) {
	// Kalau ini alamat pertama user, otomatis jadikan primary
	existing, _ := s.AddressRepo.FindAllByUser(userID)
	isPrimary := req.IsPrimary || len(existing) == 0

	if isPrimary {
		s.AddressRepo.UnsetPrimaryForUser(userID) // pastikan cuma 1 yang primary
	}

	address := models.Address{
		UserID:        userID,
		Label:         req.Label,
		RecipientName: req.RecipientName,
		Phone:         req.Phone,
		FullAddress:   req.FullAddress,
		City:          req.City,
		PostalCode:    req.PostalCode,
		IsPrimary:     isPrimary,
	}

	if err := s.AddressRepo.Create(&address); err != nil {
		return nil, err
	}

	return toAddressResponse(&address), nil
}

func (s *AddressService) GetAll(userID uint) ([]dto.AddressResponse, error) {
	addresses, err := s.AddressRepo.FindAllByUser(userID)
	if err != nil {
		return nil, err
	}

	var result []dto.AddressResponse
	for _, a := range addresses {
		result = append(result, *toAddressResponse(&a))
	}
	return result, nil
}

func (s *AddressService) SetPrimary(userID, addressID uint) error {
	address, err := s.AddressRepo.FindByID(addressID)
	if err != nil || address.UserID != userID {
		return errors.New("alamat tidak ditemukan")
	}

	if err := s.AddressRepo.UnsetPrimaryForUser(userID); err != nil {
		return err
	}
	return s.AddressRepo.DB.Model(&models.Address{}).Where("id = ?", addressID).Update("is_primary", true).Error
}

func (s *AddressService) Delete(userID, addressID uint) error {
	address, err := s.AddressRepo.FindByID(addressID)
	if err != nil || address.UserID != userID {
		return errors.New("alamat tidak ditemukan")
	}
	return s.AddressRepo.Delete(addressID)
}

func toAddressResponse(a *models.Address) *dto.AddressResponse {
	return &dto.AddressResponse{
		ID:            a.ID,
		Label:         a.Label,
		RecipientName: a.RecipientName,
		Phone:         a.Phone,
		FullAddress:   a.FullAddress,
		City:          a.City,
		PostalCode:    a.PostalCode,
		IsPrimary:     a.IsPrimary,
	}
}