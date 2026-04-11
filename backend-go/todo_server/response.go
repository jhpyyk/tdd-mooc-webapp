package todo_server

import (
	"encoding/json"
	"net/http"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

func writeTestMessageResponse(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := TestMessage{
		Message: message,
	}
	json.NewEncoder(w).Encode(response)

}

func writeItemResponse(w http.ResponseWriter, item item_store.Item) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(item); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}
}

func writeItemSliceResponse(w http.ResponseWriter, items []item_store.Item) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(items); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}
}
