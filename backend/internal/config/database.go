package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB adalah variabel global yang menyimpan koneksi database
// supaya bisa dipakai di file/package lain
var DB *gorm.DB

func ConnectDatabase() {
	// Ambil value dari .env yang sudah di-load
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// Susun connection string PostgreSQL
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s", 
		host, port, user, password, dbName,
	)

	// Buka koneksi ke database menggunakan GORM
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}

	log.Println("Database success to connect")
	DB = db
}