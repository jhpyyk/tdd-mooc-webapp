package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type ItemStore interface {
	GetDbHealthString() string
}

type ItemStoreInMemory struct {
}

func (store *ItemStoreInMemory) GetDbHealthString() string {
	return "In memory item store connection is healthy"
}

type ItemStoreImpl struct {
}

func (store *ItemStoreImpl) GetDbHealthString() string {
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		log.Fatal("TEST_DATABASE_URL not set")
	}
	db, err := sql.Open("postgres", dsn)

	if err != nil {
		log.Fatalf("Error opening db connectio %v", err)
	}

	_, err = db.Exec("SELECT 1")
	if err != nil {
		log.Fatal(err)
	}

	return "Go DB connection is healthy"
}
