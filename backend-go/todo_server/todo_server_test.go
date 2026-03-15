package todo_server_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

type ItemStoreStub struct {
	items      []item_store.Item
	throwError bool
}

func newItemStoreStub(items []item_store.Item, throwError bool) *ItemStoreStub {
	stub := ItemStoreStub{}
	stub.items = items
	stub.throwError = throwError
	return &stub
}

func (store *ItemStoreStub) GetAllItems() ([]item_store.Item, error) {
	if store.throwError {
		return nil, errors.New("error in GetAllItems")
	}
	return store.items, nil
}

func (store *ItemStoreStub) GetAllActiveItems() ([]item_store.Item, error) {
	if store.throwError {
		return nil, errors.New("error in GetAllActiveItems")
	}
	return []item_store.Item{store.items[0]}, nil
}

func (store *ItemStoreStub) GetAllArchivedItems() ([]item_store.Item, error) {
	if store.throwError {
		return nil, errors.New("error in GetAllArchivedItems")
	}
	return []item_store.Item{store.items[1]}, nil
}

func (store *ItemStoreStub) AddItem(title string) (item_store.Item, error) {
	item := item_store.Item{
		ID:       999,
		Title:    title,
		Done:     false,
		Archived: false,
	}
	return item, nil
}

func (store *ItemStoreStub) GetDbHealthString() string {
	return ""
}

func setupTestServer(t testing.TB, items []item_store.Item, throwError bool) *server.TodoServer {
	t.Helper()

	itemStore := newItemStoreStub(items, throwError)
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

	todoServer := setupTestServer(t, initialItems, false)
	itemsEndpoint := "/items"
	t.Run(itemsEndpoint+" should return all items", func(t *testing.T) {
		assertItemsEndpointReturnsCorrectItems(t, todoServer, itemsEndpoint, initialItems)
	})

	activeItemsEndpoint := "/items?archived=false"
	t.Run(activeItemsEndpoint+" should return all active items", func(t *testing.T) {
		assertItemsEndpointReturnsCorrectItems(t, todoServer, activeItemsEndpoint, []item_store.Item{initialItems[0]})
	})

	archivedItemsEndpoint := "/items?archived=true"
	t.Run(archivedItemsEndpoint+" should return all archived items", func(t *testing.T) {
		assertItemsEndpointReturnsCorrectItems(t, todoServer, archivedItemsEndpoint, []item_store.Item{initialItems[1]})
	})
}

func assertItemsEndpointReturnsCorrectItems(t testing.TB, todoServer *server.TodoServer, endpoint string, wanted []item_store.Item) {
	t.Helper()
	result := doGetToEndpoint(t, todoServer, endpoint, http.StatusOK)
	returnedItems := decodeItemSlice(t, result)
	if len(returnedItems) != len(wanted) {
		t.Fatalf("%q did not return correct items, wanted %v, got %v", endpoint, wanted, returnedItems)
	}
	assertItemsEqual(t, wanted, returnedItems)
}

func TestGetItemsItemStoreError(t *testing.T) {
	endpoints := []string{"/items", "/items?archived=true", "/items?archived=false"}
	server := setupTestServer(t, []item_store.Item{}, true)
	for _, endpoint := range endpoints {
		t.Run(endpoint+" returns 500 on item store error", func(t *testing.T) {
			doGetToEndpoint(t, server, endpoint, http.StatusInternalServerError)
		})
	}
}

func TestPostItems(t *testing.T) {
	itemsEndpoint := "/items"
	todoServer := setupTestServer(t, []item_store.Item{}, false)

	t.Run(itemsEndpoint+" should return the added item", func(t *testing.T) {
		title := "item title"
		payload := server.AddItemRequest{
			Title: title,
		}

		result := doRequestToEndpoint(t, todoServer, itemsEndpoint, http.MethodPost, payload, http.StatusOK)
		item := decodeItem(t, result)
		if title != item.Title {
			t.Fatalf("POST returned the wrong title, wanted %q, got %q", title, item.Title)
		}
	})

}

func assertItemsEqual(t testing.TB, wanted, got []item_store.Item) {
	t.Helper()
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
		t.Fatalf("GET %q did not return %v", endpoint, expectedCode)
	}
	return result
}

func doRequestToEndpoint(t testing.TB, server *server.TodoServer, endpoint string, method string, payload any, expectedCode int) *http.Response {
	t.Helper()
	buffer := new(bytes.Buffer)
	json.NewEncoder(buffer).Encode(payload)
	request, _ := http.NewRequest(method, endpoint, buffer)
	response := httptest.NewRecorder()
	server.ServeHTTP(response, request)

	result := response.Result()

	if result.StatusCode != expectedCode {
		t.Fatalf("%q %q did not return %v", method, endpoint, expectedCode)
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
