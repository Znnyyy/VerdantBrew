package repository

import (
	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type CartRepository struct {
	DB *gorm.DB
}

func NewCartRepository(db *gorm.DB) *CartRepository {
	return &CartRepository{DB: db}
}

// GetOrCreateCart: cari cart milik user, kalau belum ada, bikin baru
func (r *CartRepository) GetOrCreateCart(userID uint) (*models.Cart, error) {
	var cart models.Cart

	err := r.DB.Where("user_id = ?", userID).First(&cart).Error
	if err == gorm.ErrRecordNotFound {
		// Belum ada cart, bikin baru
		cart = models.Cart{UserID: userID}
		if err := r.DB.Create(&cart).Error; err != nil {
			return nil, err
		}
		return &cart, nil
	} else if err != nil {
		return nil, err
	}

	return &cart, nil
}

func (r *CartRepository) GetCartWithItems(cartID uint) (*models.Cart, error) {
	var cart models.Cart

	err := r.DB.
		Preload("Items.Product").
		Preload("Items.Options.OptionValue").
		First(&cart, cartID).Error

	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func (r *CartRepository) AddItem(item *models.CartItem) error {
	return r.DB.Create(item).Error
}

func (r *CartRepository) FindItemByID(itemID uint) (*models.CartItem, error) {
	var item models.CartItem
	err := r.DB.First(&item, itemID).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *CartRepository) UpdateItemQuantity(itemID uint, quantity int) error {
	return r.DB.Model(&models.CartItem{}).Where("id = ?", itemID).Update("quantity", quantity).Error
}

func (r *CartRepository) DeleteItem(itemID uint) error {
	// Hapus dulu opsi-opsinya (child), baru item-nya (parent)
	r.DB.Where("cart_item_id = ?", itemID).Delete(&models.CartItemOption{})
	return r.DB.Delete(&models.CartItem{}, itemID).Error
}

func (r *CartRepository) ClearUserCart(userID uint) error {
	var cart models.Cart
	err := r.DB.Where("user_id = ?", userID).First(&cart).Error
	if err == gorm.ErrRecordNotFound {
		return nil // belum ada cart, gak perlu dihapus apa-apa
	} else if err != nil {
		return err
	}

	// Hapus options dulu (child), baru items (parent) - urutan penting
	var itemIDs []uint
	r.DB.Model(&models.CartItem{}).Where("cart_id = ?", cart.ID).Pluck("id", &itemIDs)

	if len(itemIDs) > 0 {
		r.DB.Where("cart_item_id IN ?", itemIDs).Delete(&models.CartItemOption{})
		r.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{})
	}

	return nil
}