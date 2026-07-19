package main

import (
	"log"
	"time"

	"github.com/joho/godotenv"

	"VerdantBrew/backend/internal/config"
	"VerdantBrew/backend/internal/models"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file tidak ditemukan")
	}

	config.ConnectDatabase()
	db := config.DB

	var count int64
	db.Model(&models.Category{}).Count(&count)
	if count > 0 {
		log.Println("Data sudah ada, seeding dibatalkan.")
		return
	}

	log.Println("Mulai seeding...")

	// 1. Categories
	coffee := models.Category{Name: "Coffee", Slug: "coffee", SortOrder: 1}
	nonCoffee := models.Category{Name: "Non-Coffee", Slug: "non-coffee", SortOrder: 2}
	food := models.Category{Name: "Food", Slug: "food", SortOrder: 3}

	db.Create(&coffee)
	db.Create(&nonCoffee)
	db.Create(&food)

	// 2. Products dengan Option Groups & Values langsung dalam satu struct
	// GORM otomatis insert relasi nested kalau di-Create sekaligus (disebut "Auto Create/Update")
	latte := models.Product{
		CategoryID:  coffee.ID,
		Name:        "Double Roasted Signature Latte",
		Slug:        "double-roasted-signature-latte",
		Description: "A rich, full-bodied espresso balanced with velvety steamed milk and a thin layer of silky foam.",
		Price:       54000,
		ImageURL:    "https://images.unsplash.com/photo-1570968915860-d3fa03db4f18?w=600&q=80",
		IsAvailable: true,
		OptionGroups: []models.ProductOptionGroup{
			{
				Name:          "Sugar Level",
				SelectionType: "single",
				IsRequired:    true,
				SortOrder:     1,
				Values: []models.ProductOptionValue{
					{Label: "None", ExtraPrice: 0, SortOrder: 1},
					{Label: "Medium", ExtraPrice: 0, SortOrder: 2},
					{Label: "Full", ExtraPrice: 0, SortOrder: 3},
				},
			},
			{
				Name:          "Temperature",
				SelectionType: "single",
				IsRequired:    true,
				SortOrder:     2,
				Values: []models.ProductOptionValue{
					{Label: "Hot", ExtraPrice: 0, SortOrder: 1},
					{Label: "Iced", ExtraPrice: 0, SortOrder: 2},
				},
			},
			{
				Name:          "Extra Add-ons",
				SelectionType: "multiple",
				IsRequired:    false,
				SortOrder:     3,
				Values: []models.ProductOptionValue{
					{Label: "Extra Espresso Shot", ExtraPrice: 1000, SortOrder: 1},
					{Label: "Caramel Syrup", ExtraPrice: 500, SortOrder: 2},
				},
			},
		},
	}
	db.Create(&latte)

	velvetLatte := models.Product{
		CategoryID:  coffee.ID,
		Name:        "Velvet Hot Latte",
		Slug:        "velvet-hot-latte",
		Price:       28000,
		ImageURL:    "https://images.unsplash.com/photo-1561049501-e1f96affe5af?w=600&q=80",
		IsAvailable: true,
	}
	db.Create(&velvetLatte)

	icedAmericano := models.Product{
		CategoryID:  coffee.ID,
		Name:        "Iced Americano",
		Slug:        "iced-americano",
		Price:       24000,
		ImageURL:    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80",
		IsAvailable: true,
	}
	db.Create(&icedAmericano)

	avocadoToast := models.Product{
		CategoryID:  food.ID,
		Name:        "Avocado Toast",
		Slug:        "avocado-toast",
		Price:       45000,
		ImageURL:    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
		IsAvailable: true,
	}
	db.Create(&avocadoToast)

	verdantBurger := models.Product{
		CategoryID:  food.ID,
		Name:        "Verdant Burger",
		Slug:        "verdant-burger",
		Price:       58000,
		ImageURL:    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
		IsAvailable: true,
	}
	db.Create(&verdantBurger)

	// 3. Table (buat dine-in QR)
	table12 := models.Table{
		TableNumber: "TABLE 12",
		QRCodeToken: "qr-table-12-abc123",
		IsActive:    true,
	}
	db.Create(&table12)

	voucher := models.Voucher{
		Code:           "NGOPI10",
		DiscountType:   "percentage",
		DiscountValue:  10,
		MinOrderAmount: 20000,
		ValidFrom:      time.Now().AddDate(0, 0, -1), // mulai kemarin
		ValidUntil:     time.Now().AddDate(0, 1, 0),  // berlaku 1 bulan ke depan
		UsageLimit:     100,
		IsActive:       true,
	}
	db.Create(&voucher)

	log.Println("Seeding selesai!")
}
