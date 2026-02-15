package main

import (
	"log"
	"net/http"
)

func main() {
	itemStore := ItemStoreImpl{}
	todoServer := NewTodoServer(&itemStore)
	log.Fatal(http.ListenAndServe(":5000", http.HandlerFunc(todoServer.ServeHTTP)))
}
