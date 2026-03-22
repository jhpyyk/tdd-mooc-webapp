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

const (
	itemsEndpoint      = "/items"
	itemsArchivedTrue  = "/items?archived=true"
	itemsArchivedFalse = "/items?archived=false"
	testEndpoint       = "/test"
	dbHealthEndpoint   = "/db-health"
)

type ItemStoreStub struct {
	items              []item_store.Item
	throwError         bool
	AddItemCalledWith  []string
	EditItemCalledWith []item_store.Item
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
	store.AddItemCalledWith = append(store.AddItemCalledWith, title)
	item := item_store.Item{
		ID:       999,
		Title:    title,
		Done:     false,
		Archived: false,
	}
	return item, nil
}

func (store *ItemStoreStub) EditItem(item item_store.Item) (item_store.Item, error) {
	store.EditItemCalledWith = append(store.EditItemCalledWith, item)
	return item, nil
}

func (store *ItemStoreStub) GetDbHealthString() string {
	return ""
}

func setupTestServer(t testing.TB, items []item_store.Item, throwError bool) (*server.TodoServer, *ItemStoreStub) {
	t.Helper()

	itemStore := newItemStoreStub(items, throwError)
	todoServer := server.NewTodoServer(itemStore)
	return todoServer, itemStore
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

	todoServer, _ := setupTestServer(t, initialItems, false)
	t.Run(itemsEndpoint+" should return all items", func(t *testing.T) {
		assertItemsEndpointReturnsCorrectItems(t, todoServer, itemsEndpoint, initialItems)
	})

	t.Run(itemsArchivedFalse+" should return all active items", func(t *testing.T) {
		assertItemsEndpointReturnsCorrectItems(t, todoServer, itemsEndpoint, initialItems)
	})

	t.Run(itemsArchivedTrue+" should return all archived items", func(t *testing.T) {
		assertItemsEndpointReturnsCorrectItems(t, todoServer, itemsEndpoint, initialItems)
	})
}

func assertItemsEndpointReturnsCorrectItems(t testing.TB, todoServer *server.TodoServer, endpoint string, wanted []item_store.Item) {
	t.Helper()
	result := doRequestToEndpoint(t, todoServer, endpoint, http.MethodGet, nil, http.StatusOK)
	returnedItems := decodeItemSlice(t, result)
	if len(returnedItems) != len(wanted) {
		t.Fatalf("%q did not return correct items, wanted %v, got %v", endpoint, wanted, returnedItems)
	}
	assertItemsEqual(t, wanted, returnedItems)
}

func TestGetItemsItemStoreError(t *testing.T) {
	endpoints := []string{itemsEndpoint, itemsArchivedTrue, itemsArchivedFalse}
	server, _ := setupTestServer(t, []item_store.Item{}, true)
	for _, endpoint := range endpoints {
		t.Run(endpoint+" returns 500 on item store error", func(t *testing.T) {
			doGetToEndpoint(t, server, endpoint, http.StatusInternalServerError)
		})
	}
}

func TestPostItems(t *testing.T) {

	t.Run("POST"+itemsEndpoint+" should return the added item", func(t *testing.T) {
		todoServer, _ := setupTestServer(t, []item_store.Item{}, false)
		title := "item title"
		payload := server.AddItemRequest{
			Title: &title,
		}

		result := doRequestToEndpoint(t, todoServer, itemsEndpoint, http.MethodPost, payload, http.StatusOK)
		item := decodeItem(t, result)
		if title != item.Title {
			t.Fatalf("POST returned the wrong title, wanted %q, got %q", title, item.Title)
		}
	})

	t.Run("POST"+itemsEndpoint+" should return call item store add item method", func(t *testing.T) {
		todoServer, store := setupTestServer(t, []item_store.Item{}, false)
		title := "item title"
		payload := server.AddItemRequest{
			Title: &title,
		}

		doRequestToEndpoint(t, todoServer, itemsEndpoint, http.MethodPost, payload, http.StatusOK)

		timesCalled := len(store.AddItemCalledWith)
		if timesCalled != 1 {
			t.Fatalf("Add item was not called the right amount of times, wanted 1, got %v", timesCalled)
		}
		arg := store.AddItemCalledWith[0]
		if arg != title {
			t.Fatalf("Add item was not called with the right argument, wanted %q, got %v", title, arg)
		}

	})

}
func TestPutItems(t *testing.T) {
	initialItems := []item_store.Item{
		{
			ID:       1,
			Title:    "title",
			Done:     false,
			Archived: false,
		},
	}
	t.Run("PUT"+itemsEndpoint+" should return the edited item", func(t *testing.T) {

		todoServer, _ := setupTestServer(t, initialItems, false)
		newTitle := "new title"

		payload := server.EditItemRequest{
			ID:       1,
			Title:    newTitle,
			Done:     false,
			Archived: false,
		}

		result := doRequestToEndpoint(t, todoServer, itemsEndpoint, http.MethodPut, payload, http.StatusOK)
		item := decodeItem(t, result)
		if newTitle != item.Title {
			t.Fatalf("PUT returned the wrong title, wanted %q, got %q", newTitle, item.Title)
		}
	})

	t.Run("PUT"+itemsEndpoint+" should return call item store edit item", func(t *testing.T) {
		todoServer, store := setupTestServer(t, []item_store.Item{}, false)
		title := "item title"
		payload := server.EditItemRequest{
			ID:       1,
			Title:    title,
			Done:     false,
			Archived: false,
		}

		doRequestToEndpoint(t, todoServer, itemsEndpoint, http.MethodPut, payload, http.StatusOK)

		timesCalled := len(store.EditItemCalledWith)
		if timesCalled != 1 {
			t.Fatalf("Edit item was not called the right amount of times, wanted 1, got %v", timesCalled)
		}
		arg := store.EditItemCalledWith[0]
		if arg.Title != title {
			t.Fatalf("Edit item was not called with the right argument, wanted %q, got %v", title, arg)
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
