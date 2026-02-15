package main

import (
	"encoding/json"
	"net/http"
)

type TodoServer struct {
	store ItemStore
	http.Handler
}

func NewTodoServer(itemStore ItemStore) *TodoServer {
	server := new(TodoServer)
	server.store = itemStore
	router := http.NewServeMux()

	router.Handle("/test", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Hello from go backend",
		})
	}))
	router.Handle("/db-health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		healthString := itemStore.GetDbHealthString()
		json.NewEncoder(w).Encode(map[string]string{
			"message": healthString,
		})
	}))
	server.Handler = router

	return server
}
