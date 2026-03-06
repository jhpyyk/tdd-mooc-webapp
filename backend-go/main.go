package main

import (
	"log"
	"net/http"

	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

func main() {
	itemStore := store.ItemStoreImpl{}
	todoServer := server.NewTodoServer(&itemStore)
	log.Fatal(http.ListenAndServe(":5000", http.HandlerFunc(todoServer.ServeHTTP)))
}
