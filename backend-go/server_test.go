package main_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go"
)

func TestGetBackendE2ETestString(t *testing.T) {
	t.Run("should return backend e2e test string", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/test", nil)
		response := httptest.NewRecorder()
		server.TodoServer(response, request)

		var body map[string]string
		err := json.NewDecoder(response.Body).Decode(&body)
		if err != nil {
			t.Fatalf("Unable to parse json from server %q into TestMessage, '%v'", response.Body, err)
		}

		wantedMessage := "Hello from go backend"

		if body["message"] != wantedMessage {
			t.Errorf("got %q, want %q", body, wantedMessage)
		}
	})
	t.Run("should return DB health-check string", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/db-health", nil)
		response := httptest.NewRecorder()
		server.TodoServer(response, request)

		var body map[string]string
		err := json.NewDecoder(response.Body).Decode(&body)
		if err != nil {
			t.Fatalf("Unable to parse json from server %q into TestMessage, '%v'", response.Body, err)
		}

		wantedMessage := "DB connection is healthy"

		if body["message"] != wantedMessage {
			t.Errorf("got %q, want %q", body, wantedMessage)
		}
	})
}
