package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
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
	config.InitMidtrans()

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
		&models.PointTransaction{},
		&models.Cart{},
		&models.CartItem{},
		&models.CartItemOption{},
		&models.Address{},
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

	// Wiring Address
	addressRepo := repository.NewAddressRepository(config.DB)
	addressService := service.NewAddressService(addressRepo)
	addressHandler := handler.NewAddressHandler(addressService)

	// Wiring Order
	orderRepo := repository.NewOrderRepository(config.DB)
	
	// Wiring Payment
	paymentRepo := repository.NewPaymentRepository(config.DB)
	paymentService := service.NewPaymentService(paymentRepo, orderRepo)
	paymentHandler := handler.NewPaymentHandler(paymentService)
	
	// Wiring Order
	orderService := service.NewOrderService(orderRepo, cartRepo, tableRepo, userRepo, addressRepo, voucherService, paymentService)
	orderHandler := handler.NewOrderHandler(orderService)

	app := fiber.New()

	// CORS middleware - izinkan request dari mobile & web
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	}))

	// Public routes
	app.Post("/api/register", authHandler.Register)
	app.Post("/api/login", authHandler.Login)

	// Protected route - get profile
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

	// order
	app.Post("/api/orders/checkout", middleware.AuthRequired, orderHandler.Checkout)

	// address
	app.Post("/api/addresses", middleware.AuthRequired, addressHandler.Create)
	app.Get("/api/addresses", middleware.AuthRequired, addressHandler.GetAll)
	app.Put("/api/addresses/:id/set-primary", middleware.AuthRequired, addressHandler.SetPrimary)
	app.Delete("/api/addresses/:id", middleware.AuthRequired, addressHandler.Delete)

	// Route webhook - PUBLIC, tanpa middleware.AuthRequired
	app.Post("/api/payments/notification", paymentHandler.HandleNotification)

	log.Fatal(app.Listen(":5000"))
}
