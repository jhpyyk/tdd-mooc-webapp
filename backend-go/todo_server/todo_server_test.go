package todo_server_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
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
	t.Run("should return all items", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/items", nil)
		response := httptest.NewRecorder()
		todoServer.ServeHTTP(response, request)

		if response.Result().StatusCode != http.StatusOK {
			t.Fatalf("GET /items did not return 200")
		}
	})
}

type ItemStoreStub struct {
	items []item_store.Item
}

func (store *ItemStoreStub) GetDbHealthString() string {
	return ""
}

func newItemStoreStub(items []item_store.Item) *ItemStoreStub {
	stub := ItemStoreStub{}
	stub.items = items
	return &stub
}

func (store *ItemStoreStub) GetItem() item_store.Item {
	return store.items[0]
}

func TestGetOneItem(t *testing.T) {
	items := []item_store.Item{{
		ID:       1,
		Title:    "title",
		Done:     false,
		Archived: false,
	}}
	itemStore := newItemStoreStub(items)
	todoServer := server.NewTodoServer(itemStore)

	t.Run("GET /items/1 should return the item", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/items/1", nil)
		response := httptest.NewRecorder()
		todoServer.ServeHTTP(response, request)

		result := response.Result()

		if result.StatusCode != http.StatusOK {
			t.Fatalf("GET /items/1 did not return 200")
		}

		var item item_store.Item
		err := json.NewDecoder(result.Body).Decode(&item)
		if err != nil {
			t.Fatalf("Unable to parse json from server %q into TestMessage, '%v'", response.Body, err)
		}

		if !reflect.DeepEqual(item, items[0]) {
			t.Fatalf("did not return %v, returned %v", items[0], item)
		}
	})
}
