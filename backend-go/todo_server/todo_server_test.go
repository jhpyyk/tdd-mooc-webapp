package todo_server_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

func TestGetBackendE2ETestString(t *testing.T) {
	itemStore := store.ItemStoreImpl{}
	todoServer := server.NewTodoServer(&itemStore)
	t.Run("should return backend e2e test string", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/test", nil)
		response := httptest.NewRecorder()
		todoServer.ServeHTTP(response, request)

		var body map[string]string
		err := json.NewDecoder(response.Body).Decode(&body)
		if err != nil {
			t.Fatalf("Unable to parse json from server %q into TestMessage, '%v'", response.Body, err)
		}

		wantedMessage := "Hello from go backend"

		if body["message"] != wantedMessage {
			t.Errorf("got %q, want %q", body["message"], wantedMessage)
		}
	})
}

func TestGetAllItems(t *testing.T) {
	itemStore := store.ItemStoreImpl{}
	todoServer := server.NewTodoServer(&itemStore)
	t.Run("should return 200", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/items", nil)
		response := httptest.NewRecorder()
		todoServer.ServeHTTP(response, request)

		if response.Result().StatusCode != http.StatusOK {
			t.Fatalf("GET /items did not return 200")
		}
	})
}
