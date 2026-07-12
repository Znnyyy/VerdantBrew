package handler

import (
	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type OrderHandler struct {
	OrderService *service.OrderService
}

func NewOrderHandler(orderService *service.OrderService) *OrderHandler {
	return &OrderHandler{OrderService: orderService}
}

func (h *OrderHandler) Checkout(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var req dto.CheckoutRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Format request tidak valid"})
	}

	result, err := h.OrderService.Checkout(userID, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": result})
}