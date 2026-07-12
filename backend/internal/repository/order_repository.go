package repository

import (
	"fmt"
	"math/rand"
	"time"

	"VerdantBrew/backend/internal/models"

	"gorm.io/gorm"
)

type OrderRepository struct {
	DB *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{DB: db}
}

// GenerateOrderCode bikin kode unik seperti "VB-882910"
func (r *OrderRepository) GenerateOrderCode() string {
	rand.Seed(time.Now().UnixNano())
	number := rand.Intn(900000) + 100000
	return fmt.Sprintf("VB-%d", number)
}

func (r *OrderRepository) CreateOrder(tx *gorm.DB, order *models.Order) error {
	return tx.Create(order).Error
}

func (r *OrderRepository) CreateOrderVoucher(tx *gorm.DB, ov *models.OrderVoucher) error {
	return tx.Create(ov).Error
}

func (r *OrderRepository) CreatePointTransaction(tx *gorm.DB, pt *models.PointTransaction) error {
	return tx.Create(pt).Error
}

// UpdateUserPoints menambah/mengurangi saldo poin secara atomic
func (r *OrderRepository) UpdateUserPoints(tx *gorm.DB, userID uint, delta int) error {
	return tx.Model(&models.User{}).
		Where("id = ?", userID).
		UpdateColumn("points_balance", gorm.Expr("points_balance + ?", delta)).Error
}

// BeginTransaction expose fungsi transaction dari GORM
func (r *OrderRepository) WithTransaction(fn func(tx *gorm.DB) error) error {
	return r.DB.Transaction(fn)
}
