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
		writeJSON(w, 200, JSON{
			"message": "Hello from go backend",
		})
	}))
	router.Handle("/db-health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		healthString := itemStore.GetDbHealthString()
		writeJSON(w, http.StatusOK, JSON{
			"message": healthString,
		})
	}))
	server.Handler = corsMiddleware(router)

	return server
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")

	payloadMap, ok := payload.(JSON)
	if ok != true {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payloadMap)
}
