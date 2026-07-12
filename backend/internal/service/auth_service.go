package service

import (
	"errors"
	"log"
	"os"
	"time"

	"VerdantBrew/backend/internal/dto"
	"VerdantBrew/backend/internal/models"
	"VerdantBrew/backend/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserRepo *repository.UserRepository
	CartRepo *repository.CartRepository
}

func NewAuthService(userRepo *repository.UserRepository, cartRepo *repository.CartRepository) *AuthService {
	return &AuthService{UserRepo: userRepo, CartRepo: cartRepo}
}

func (s *AuthService) Register(req dto.RegisterRequest) (*dto.AuthResponse, error) {
	// cek apakah email sudah terdaftar
	existingUser, _ := s.UserRepo.FindByEmail(req.Email)
	if existingUser != nil {
		return nil, errors.New("Email sudah terdaftar")
	}

	// hash password jangan pernah simpan password asli di database
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		FullName:     req.FullName,
		Email:        req.Email,
		Phone:        req.Phone,
		PasswordHash: string(hashedPassword),
		Provider:     "local",
	}

	if err := s.UserRepo.Create(user); err != nil {
		return nil, err
	}

	token, err := generateJWT(user.ID)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User: dto.UserResponse{
			ID:       user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Phone:    user.Phone,
		},
	}, nil
}

func (s *AuthService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.UserRepo.FindByEmail(req.Email)
	if err != nil || user == nil {
		return nil, errors.New("email atau password salah")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	// Bersihkan cart lama - sesuai sifat "temporary" yang diinginkan
	if err := s.CartRepo.ClearUserCart(user.ID); err != nil {
		// Jangan gagalkan login cuma karena clear cart gagal - cukup log saja
		log.Println("Gagal clear cart:", err)
	}

	token, err := generateJWT(user.ID)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User: dto.UserResponse{
			ID:       user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Phone:    user.Phone,
		},
	}, nil
}

// generateJWT bikin token yang isinya user ID + waktu kedaluwarsa
func generateJWT(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(), // token berlaku 24 jam
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
