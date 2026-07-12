package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"

	"VerdantBrew/backend/internal/config"
	"VerdantBrew/backend/internal/handler"
	"VerdantBrew/backend/internal/middleware"
	"VerdantBrew/backend/internal/models"
	"VerdantBrew/backend/internal/repository"
	"VerdantBrew/backend/internal/service"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file tidak ditemukan")
	}

	config.ConnectDatabase()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.ProductOptionGroup{},
		&models.ProductOptionValue{},
		&models.Table{},
		&models.Voucher{},
		&models.Order{},
		&models.OrderItem{},
		&models.OrderVoucher{},
		&models.OrderItemOption{},
		&models.Payment{},
		&models.Cart{},
		&models.CartItem{},
		&models.CartItemOption{},
	)

	// Wiring: repository -> service -> handler
	userRepo := repository.NewUserRepository(config.DB)
	cartRepo := repository.NewCartRepository(config.DB)
	authService := service.NewAuthService(userRepo, cartRepo)
	authHandler := handler.NewAuthHandler(authService)

	// Wiring Product & Category
	productRepo := repository.NewProductRepository(config.DB)
	categoryRepo := repository.NewCategoryRepository(config.DB)
	productService := service.NewProductService(productRepo, categoryRepo)
	productHandler := handler.NewProductHandler(productService)

	// Wiring Cart
	cartService := service.NewCartService(cartRepo, productRepo)
	cartHandler := handler.NewCartHandler(cartService)

	// Wiring Table
	tableRepo := repository.NewTableRepository(config.DB)
	tableService := service.NewTableService(tableRepo)
	tableHandler := handler.NewTableHandler(tableService)

	// Wiring Voucher
	voucherRepo := repository.NewVoucherRepository(config.DB)
	voucherService := service.NewVoucherService(voucherRepo)
	voucherHandler := handler.NewVoucherHandler(voucherService)

	app := fiber.New()

	// Public routes
	app.Post("/api/register", authHandler.Register)
	app.Post("/api/login", authHandler.Login)
	app.Get("/api/profile", middleware.AuthRequired, func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"user_id": c.Locals("user_id")})
	})

	// Contoh protected route (nanti dipakai buat fitur order dkk)
	app.Get("/api/profile", middleware.AuthRequired, func(c fiber.Ctx) error {
		userID := c.Locals("user_id")
		return c.JSON(fiber.Map{"user_id": userID})
	})

	// category & products
	app.Get("/api/categories", productHandler.GetCategories)
	app.Get("/api/products", productHandler.GetAll)
	app.Get("/api/products/:id", productHandler.GetDetail)

	// cart
	app.Post("/api/cart/items", middleware.AuthRequired, cartHandler.AddItem)
	app.Get("/api/cart", middleware.AuthRequired, cartHandler.GetCart)
	app.Put("/api/cart/items/:itemId", middleware.AuthRequired, cartHandler.UpdateItem)
	app.Delete("/api/cart/items/:itemId", middleware.AuthRequired, cartHandler.DeleteItem)

	// table & voucher
	app.Get("/api/tables/scan/:token", middleware.AuthRequired, tableHandler.ScanQR)
	app.Post("/api/vouchers/validate", middleware.AuthRequired, voucherHandler.Validate)

	log.Fatal(app.Listen(":5000"))
}
