package service

import (
	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/repository"
)

type ProductService struct {
	ProductRepo  *repository.ProductRepository
	CategoryRepo *repository.CategoryRepository
}

func NewProductService(productRepo *repository.ProductRepository, categoryRepo *repository.CategoryRepository) *ProductService {
	return &ProductService{ProductRepo: productRepo, CategoryRepo: categoryRepo}
}

func (s *ProductService) GetAllProducts(categoryID uint) ([]dto.ProductListResponse, error) {
	products, err := s.ProductRepo.FindAll(categoryID)
	if err != nil {
		return nil, err
	}

	// Mapping dari models.Product ke dto.ProductListResponse
	var result []dto.ProductListResponse
	for _, p := range products {
		result = append(result, dto.ProductListResponse{
			ID:          p.ID,
			Name:        p.Name,
			Price:       p.Price,
			ImageURL:    p.ImageURL,
			IsAvailable: p.IsAvailable,
		})
	}

	return result, nil
}

func (s *ProductService) GetProductDetail(id uint) (*dto.ProductDetailResponse, error) {
	product, err := s.ProductRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	var optionGroups []dto.OptionGroupResponse
	for _, og := range product.OptionGroups {
		var values []dto.OptionValueResponse
		for _, v := range og.Values {
			values = append(values, dto.OptionValueResponse{
				ID:         v.ID,
				Label:      v.Label,
				ExtraPrice: v.ExtraPrice,
			})
		}

		optionGroups = append(optionGroups, dto.OptionGroupResponse{
			ID:            og.ID,
			Name:          og.Name,
			SelectionType: og.SelectionType,
			IsRequired:    og.IsRequired,
			Values:        values,
		})
	}

	return &dto.ProductDetailResponse{
		ID:           product.ID,
		Name:         product.Name,
		Description:  product.Description,
		Price:        product.Price,
		ImageURL:     product.ImageURL,
		IsAvailable:  product.IsAvailable,
		CategoryName: product.Category.Name,
		OptionGroups: optionGroups,
	}, nil
}

func (s *ProductService) GetAllCategories() ([]dto.CategoryResponse, error) {
	categories, err := s.CategoryRepo.FindAll()
	if err != nil {
		return nil, err
	}

	var result []dto.CategoryResponse
	for _, c := range categories {
		result = append(result, dto.CategoryResponse{ID: c.ID, Name: c.Name, Slug: c.Slug})
	}
	return result, nil
}
