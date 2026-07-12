package service

import (
	"errors"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/repository"
)

type TableService struct {
	TableRepo *repository.TableRepository
}

func NewTableService(tableRepo *repository.TableRepository) *TableService {
	return &TableService{TableRepo: tableRepo}
}

func (s *TableService) ScanQR(token string) (*dto.TableResponse, error) {
	table, err := s.TableRepo.FindByQRToken(token)
	if err != nil {
		return nil, errors.New("QR code tidak valid atau meja tidak aktif")
	}

	return &dto.TableResponse{
		ID:          table.ID,
		TableNumber: table.TableNumber,
		IsActive:    table.IsActive,
	}, nil
}
