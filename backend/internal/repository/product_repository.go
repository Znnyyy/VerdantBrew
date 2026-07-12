package repository

import (
	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type ProductRepository struct {
	DB *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{DB: db}
}

func (r *ProductRepository) FindAll(categoryID uint) ([]models.Product, error) {
	var products []models.Product

	query := r.DB.Where("is_available = ?", true)

	// kalau categoryID dikirim bukan 0, filter berdasarkan kategori
	if categoryID != 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	err := query.Find(&products).Error
	return products, err
}

func (r *ProductRepository) FindByID(id uint) (*models.Product, error) {
	var product models.Product
	err := r.DB.
		Preload("Category").
		Preload("OptionGroups").
		Preload("OptionGroups.Values").
		First(&product, id).Error

	if err != nil {
		return nil, err
	}
	return &product, nil
}

type CategoryRepository struct {
	DB *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{DB: db}
}

func (r *CategoryRepository) FindAll() ([]models.Category, error) {
	var categories []models.Category
	err := r.DB.Order("sort_order asc").Find(&categories).Error
	return categories, err
}
