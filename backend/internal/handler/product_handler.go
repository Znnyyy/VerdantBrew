package handler

import (
	"strconv"

	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type ProductHandler struct {
	ProductService *service.ProductService
}

func NewProductHandler(productService *service.ProductService) *ProductHandler {
	return &ProductHandler{ProductService: productService}
}

func (h *ProductHandler) GetAll(c fiber.Ctx) error {
	// Ambil query param ?category_id=1 (opsional)
	categoryIDStr := c.Query("category_id", "0")
	categoryID, _ := strconv.ParseUint(categoryIDStr, 10, 32)

	products, err := h.ProductService.GetAllProducts(uint(categoryID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": products})
}

func (h *ProductHandler) GetDetail(c fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	product, err := h.ProductService.GetProductDetail(uint(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Produk tidak ditemukan"})
	}

	return c.JSON(fiber.Map{"data": product})
}

func (h *ProductHandler) GetCategories(c fiber.Ctx) error {
	categories, err := h.ProductService.GetAllCategories()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": categories})
}