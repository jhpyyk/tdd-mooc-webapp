package main

import (
	"encoding/json"
	"net/http"
)

func TodoServer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Hello from go backend",
	})
}
