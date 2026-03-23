package item_store_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/test_helpers"
	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

func TestItemStoreIntegration(t *testing.T) {
	itemStore := item_store.ItemStoreImpl{}
	t.Run("Test ItemStoreImpl health check", func(t *testing.T) {
		test_helpers.IntegrationTest(t)
		dbHealthString := itemStore.GetDbHealthString()
		expected := "Go DB connection is healthy"
		if dbHealthString != expected {
			t.Errorf("Health check string does not match. Got %q, expected %q", dbHealthString, expected)
		}
	})
}

func TestGetBackendE2ETestString(t *testing.T) {
	itemStore := item_store.ItemStoreImpl{}
	todoServer := todo_server.NewTodoServer(&itemStore)
	t.Run("should return backend e2e test string", func(t *testing.T) {
		test_helpers.IntegrationTest(t)
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
