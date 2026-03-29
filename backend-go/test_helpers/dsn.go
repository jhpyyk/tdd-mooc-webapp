package test_helpers

import (
	"log"
	"os"
)

func GetTestDBDsnString() string {
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		log.Fatal("TEST_DATABASE_URL not set")
	}
	return dsn
}
