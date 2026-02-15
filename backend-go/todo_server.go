package main

import (
	"encoding/json"
	"net/http"
)

func TodoServer(w http.ResponseWriter, r *http.Request) {
	router := http.NewServeMux()

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	router.Handle("/test", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Hello from go backend",
		})
	}))
	router.Handle("/db-health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Go DB connection is healthy",
		})
	}))
	router.ServeHTTP(w, r)

}
