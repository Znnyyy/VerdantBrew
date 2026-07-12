package handler

import (
	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type TableHandler struct {
	TableService *service.TableService
}

func NewTableHandler(tableService *service.TableService) *TableHandler {
	return &TableHandler{TableService: tableService}
}

func (h *TableHandler) ScanQR(c fiber.Ctx) error {
	token := c.Params("token")

	table, err := h.TableService.ScanQR(token)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": table})
}
