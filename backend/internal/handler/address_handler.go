package handler

import (
	"strconv"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/service"

	"github.com/gofiber/fiber/v3"
)

type AddressHandler struct {
	AddressService *service.AddressService
}

func NewAddressHandler(addressService *service.AddressService) *AddressHandler {
	return &AddressHandler{AddressService: addressService}
}

func (h *AddressHandler) Create(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var req dto.CreateAddressRequest
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	result, err := h.AddressService.Create(userID, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": result})
}

func (h *AddressHandler) SetPrimary(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	addressID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID tidak valid "})
	}

	if err := h.AddressService.SetPrimary(userID, uint(addressID)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Alamat utama berhasil diubah"})
}

func (h *AddressHandler) GetAll(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	addresses, err := h.AddressService.GetAll(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": addresses})
}

func (h *AddressHandler) Delete(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	addressID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	if err := h.AddressService.Delete(userID, uint(addressID)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"massage": "Alamat berhasil dihapus"})
}
