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

type ItemStoreStub struct {
	items []item_store.Item
}

func newItemStoreStub(items []item_store.Item) *ItemStoreStub {
	stub := ItemStoreStub{}
	stub.items = items
	return &stub
}

func (store *ItemStoreStub) GetAllItems() []item_store.Item {
	return store.items
}

func (store *ItemStoreStub) GetAllActiveItems() []item_store.Item {
	return []item_store.Item{store.items[0]}
}

func (store *ItemStoreStub) GetAllArchivedItems() []item_store.Item {
	return []item_store.Item{store.items[1]}
}

func (store *ItemStoreStub) GetDbHealthString() string {
	return ""
}

func setupTestServer(t testing.TB, items []item_store.Item) *server.TodoServer {
	t.Helper()

	itemStore := newItemStoreStub(items)
	todoServer := server.NewTodoServer(itemStore)
	return todoServer
}

func TestGetItems(t *testing.T) {

	initialItems := []item_store.Item{
		{
			ID:       1,
			Title:    "title",
			Done:     false,
			Archived: false,
		},
		{
			ID:       2,
			Title:    "title",
			Done:     false,
			Archived: true,
		},
	}

	todoServer := setupTestServer(t, initialItems)
	t.Run("/items should return all items", func(t *testing.T) {
		result := doGetToEndpoint(t, todoServer, "/items", http.StatusOK)
		items := decodeItemSlice(t, result)
		if len(items) != 2 {
			t.Fatalf("/items did not return correct items, wanted %v, got %v", initialItems, items)
		}
		assertItemEqual(t, initialItems[0], items[0])
		assertItemEqual(t, initialItems[1], items[1])
	})

	activeItemsEndpoint := "/items?archived=false"
	t.Run(activeItemsEndpoint+" should return all active items", func(t *testing.T) {

		result := doGetToEndpoint(t, todoServer, activeItemsEndpoint, http.StatusOK)
		items := decodeItemSlice(t, result)
		if len(items) != 1 {
			t.Fatalf("%q did not return correct items, wanted %v, got %v", activeItemsEndpoint, initialItems[0], items)
		}
		assertItemEqual(t, initialItems[0], items[0])
	})

	t.Run("/archived-items should return all archived items", func(t *testing.T) {

		result := doGetToEndpoint(t, todoServer, "/archived-items", http.StatusOK)
		items := decodeItemSlice(t, result)
		if len(items) != 1 {
			t.Fatalf("/archived-items did not return correct items, wanted %v, got %v", initialItems[1], items)
		}
		assertItemEqual(t, initialItems[1], items[0])
	})
}

func assertItemEqual(t testing.TB, wanted, got item_store.Item) {
	if !reflect.DeepEqual(wanted, got) {
		t.Fatalf("items are not equal wanted %v, got %v", wanted, got)
	}
}

func decodeItem(t testing.TB, result *http.Response) item_store.Item {
	t.Helper()
	var item item_store.Item
	err := json.NewDecoder(result.Body).Decode(&item)
	if err != nil {
		t.Fatalf("Unable to parse json from server %q into Item, '%v'", result.Body, err)
	}
	return item
}
func decodeItemSlice(t testing.TB, result *http.Response) []item_store.Item {
	t.Helper()
	var items []item_store.Item
	err := json.NewDecoder(result.Body).Decode(&items)
	if err != nil {
		t.Fatalf("Unable to parse json from server %q into Item, '%v'", result.Body, err)
	}
	return items
}

func doGetToEndpoint(t testing.TB, server *server.TodoServer, endpoint string, expectedCode int) *http.Response {
	t.Helper()
	request, _ := http.NewRequest(http.MethodGet, endpoint, nil)
	response := httptest.NewRecorder()
	server.ServeHTTP(response, request)

	result := response.Result()

	if result.StatusCode != expectedCode {
		t.Fatalf("GET %q did not return %q", endpoint, expectedCode)
	}
	return result
}

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
