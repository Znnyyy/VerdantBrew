package handler

import (
	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type VoucherHandler struct {
	VoucherService *service.VoucherService
}

func NewVoucherHandler(voucherService *service.VoucherService) *VoucherHandler {
	return &VoucherHandler{VoucherService: voucherService}
}

func (h *VoucherHandler) Validate(c fiber.Ctx) error {
	var req dto.ValidateVoucherRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Format request tidak valid"})
	}

	result, err := h.VoucherService.ValidateVoucher(req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": result})
}
