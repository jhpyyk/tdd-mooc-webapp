package item_store

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Item struct {
	ID       int
	Title    string
	Done     bool
	Archived bool
}

type ItemStore interface {
	GetDbHealthString() string
	GetItem(id string) Item
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

func (store *ItemStoreImpl) GetItem(id string) Item {
	panic("not implemented")
}
