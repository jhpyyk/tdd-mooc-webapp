package todo_server

import (
	"encoding/json"
	"net/http"
	"strconv"
)

func mustDecodeAndValidateEditItemRequest(w http.ResponseWriter, r *http.Request) (*EditItemRequest, bool) {
	var req EditItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return nil, false
	}
	if err := req.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return nil, false
	}
	return &req, true
}

func mustParsePathID(w http.ResponseWriter, r *http.Request, key string) (int, bool) {
	id, err := strconv.Atoi(r.PathValue(key))
	if err != nil || id <= 0 {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return 0, false
	}
	return id, true
}
