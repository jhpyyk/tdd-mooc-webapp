package main

import (
	"log"
	"net/http"
	"os"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL not set")
	}
	itemStore := item_store.NewItemStore(dsn)
	todoServer := server.NewTodoServer(itemStore)
	log.Fatal(http.ListenAndServe(":5000", http.HandlerFunc(todoServer.ServeHTTP)))
}
