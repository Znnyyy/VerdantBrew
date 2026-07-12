package handler

import (
	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type PaymentHandler struct {
	PaymentService *service.PaymentService
}

func NewPaymentHandler(paymentService *service.PaymentService) *PaymentHandler {
	return &PaymentHandler{PaymentService: paymentService}
}

func (h *PaymentHandler) HandleNotification(c fiber.Ctx) error {
	var payload map[string]interface{}
	if err := c.Bind().Body(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
	}

	if err := h.PaymentService.HandleNotification(payload); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return  c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Notifikasi berhasil diproses"})
}