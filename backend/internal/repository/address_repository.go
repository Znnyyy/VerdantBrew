package repository

import (
	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type AddressRepository struct {
	DB *gorm.DB
}

func (r *AddressRepository) FindByID(addressID uint) (*models.Address, error) {
	var address models.Address
	err := r.DB.First(&address, addressID).Error
	if err != nil {
		return nil, err
	}
	return &address, nil
}

func NewAddressRepository(db *gorm.DB) *AddressRepository {
	return &AddressRepository{DB: db}
}

func (r *AddressRepository) Create(address *models.Address) error {
	return r.DB.Create(address).Error
}

func (r *AddressRepository) FindAllByUser(userID uint) ([]models.Address, error) {
	var addresses []models.Address
	err := r.DB.Where("user_id = ?", userID).Order("is_primary desc").Find(&addresses).Error
	return addresses, err
}

func (r *AddressRepository) UnsetPrimaryForUser(userID uint) error {
	return r.DB.Model(&models.Address{}).Where("user_id = ? AND is_primary = ?", userID, true).
		Update("is_primary", false).Error
}

func (r *AddressRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Address{}, id).Error
}
