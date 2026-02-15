package main

import (
	"encoding/json"
	"net/http"
)

type TodoServer struct {
	store ItemStore
	http.Handler
}

type JSON = map[string]string

func NewTodoServer(itemStore ItemStore) *TodoServer {
	server := new(TodoServer)
	server.store = itemStore
	router := http.NewServeMux()

	router.Handle("/test", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		writeJSON(w, 200, JSON{
			"message": "Hello from go backend",
		})
	}))
	router.Handle("/db-health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		healthString := itemStore.GetDbHealthString()
		writeJSON(w, 200, JSON{
			"message": healthString,
		})
	}))
	server.Handler = router

	return server
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")

	payloadMap, ok := payload.(JSON)
	if ok != true {
		w.WriteHeader(500)
		return
	}
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payloadMap)
}
