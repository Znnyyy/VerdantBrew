package config

import (
	"os"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

var SnapClient snap.Client

func InitMidtrans() {
	severKey := os.Getenv("MIDTRANS_SERVER_KEY")

	SnapClient.New(severKey, midtrans.Sandbox)
}