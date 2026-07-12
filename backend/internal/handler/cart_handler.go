package handler

import (
	"strconv"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type CartHandler struct {
	CartService *service.CartService
}

func NewCartHandler(cartService *service.CartService) *CartHandler {
	return &CartHandler{CartService: cartService}
}

func (h *CartHandler) AddItem(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var req dto.AddCartItemRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Format request tidak valid"})
	}

	if err := h.CartService.AddItem(userID, req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Item berhasil ditambahkan ke keranjang"})
}

func (h *CartHandler) GetCart(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	cart, err := h.CartService.GetCart(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": cart})
}

func (h *CartHandler) UpdateItem(c fiber.Ctx) error {
	itemID, err := strconv.ParseUint(c.Params("itemId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	var req dto.UpdateCartItemRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Format request tidak valid"})
	}

	if err := h.CartService.UpdateItemQuantity(uint(itemID), req.Quantity); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Quantity berhasil diupdate"})
}

func (h *CartHandler) DeleteItem(c fiber.Ctx) error {
	itemID, err := strconv.ParseUint(c.Params("itemId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	if err := h.CartService.DeleteItem(uint(itemID)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Item berhasil dihapus dari keranjang"})
}