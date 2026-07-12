package repository

import (
	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type TableRepository struct {
	DB *gorm.DB
}

func NewTableRepository(db *gorm.DB) *TableRepository {
	return &TableRepository{DB: db}
}

func (r *TableRepository) FindByQRToken(token string) (*models.Table, error) {
	var table models.Table
	err := r.DB.Where("qr_code_token = ? AND is_active = ?", token, true).First(&table).Error
	if err != nil {
		return nil, err
	}
	return &table, nil
}

func (r *TableRepository) FindByID(id uint) (*models.Table, error) {
	var table models.Table
	err := r.DB.First(&table, id).Error
	if err != nil {
		return nil, err
	}
	return &table, nil
}
