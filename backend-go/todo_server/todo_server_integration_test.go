package todo_server_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	helpers "github.com/jhpyyk/tdd-mooc-webapp/backend-go/test_helpers"
	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

func TestGetBackendE2ETestStringIntegration(t *testing.T) {
	itemStore := store.ItemStoreImpl{}
	todoServer := server.NewTodoServer(&itemStore)

	t.Run("should return DB health-check string", func(t *testing.T) {
		helpers.IntegrationTest(t)
		request, _ := http.NewRequest(http.MethodGet, "/db-health", nil)
		response := httptest.NewRecorder()
		todoServer.ServeHTTP(response, request)

		var body map[string]string
		err := json.NewDecoder(response.Body).Decode(&body)
		if err != nil {
			t.Fatalf("Unable to parse json from server %q into TestMessage, '%v'", response.Body, err)
		}

		wantedMessage := "Go DB connection is healthy"

		if body["message"] != wantedMessage {
			t.Errorf("got %q, want %q", body["message"], wantedMessage)
		}
	})
}
