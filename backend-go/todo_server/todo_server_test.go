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
	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

const (
	itemsEndpoint        = "/items"
	itemsEndpointWithID1 = "/items/1"
	itemsArchivedTrue    = "/items?archived=true"
	itemsArchivedFalse   = "/items?archived=false"
	archiveDoneItems     = "/archive-done"
	testEndpoint         = "/test"
	dbHealthEndpoint     = "/db-health"
)

type ItemStoreStub struct {
	items                       []item_store.Item
	throwError                  error
	AddItemCalledWith           []string
	EditItemCalledWith          []item_store.Item
	ArchiveDoneItemsCalledTimes int
	DeleteItemCalledWith        []int
}

func newItemStoreStub(items []item_store.Item, throwError error) *ItemStoreStub {
	stub := ItemStoreStub{}
	stub.items = items
	stub.throwError = throwError
	return &stub
}

func (store *ItemStoreStub) GetAllItems() ([]item_store.Item, error) {
	if store.throwError != nil {
		return nil, store.throwError
	}
	return store.items, nil
}

func (store *ItemStoreStub) GetAllActiveItems() ([]item_store.Item, error) {
	if store.throwError != nil {
		return nil, store.throwError
	}
	return []item_store.Item{store.items[0]}, nil
}

func (store *ItemStoreStub) GetAllArchivedItems() ([]item_store.Item, error) {
	if store.throwError != nil {
		return nil, store.throwError
	}
	return []item_store.Item{store.items[1]}, nil
}

func (store *ItemStoreStub) AddItem(title string) (item_store.Item, error) {
	store.AddItemCalledWith = append(store.AddItemCalledWith, title)
	if store.throwError != nil {
		return item_store.Item{}, store.throwError
	}
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
	if store.throwError != nil {
		return item_store.Item{}, store.throwError
	}
	return item, nil
}

func (store *ItemStoreStub) DeleteItem(id int) error {
	store.DeleteItemCalledWith = append(store.DeleteItemCalledWith, id)
	if store.throwError != nil {
		return store.throwError
	}
	return nil
}

func (store *ItemStoreStub) ArchiveDoneItems() error {
	store.ArchiveDoneItemsCalledTimes += 1
	if store.throwError != nil {
		return store.throwError
	}
	return nil
}

func (store *ItemStoreStub) GetDbHealthString() string {
	return ""
}

func setupTestServer(t testing.TB, items []item_store.Item, throwError error) (*todo_server.TodoServer, *ItemStoreStub) {
	t.Helper()

	itemStore := newItemStoreStub(items, throwError)
	todoServer := todo_server.NewTodoServer(itemStore)
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

	todoServer, _ := setupTestServer(t, initialItems, nil)
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

func assertItemsEndpointReturnsCorrectItems(t testing.TB, todoServer *todo_server.TodoServer, endpoint string, wanted []item_store.Item) {
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
	server, _ := setupTestServer(t, []item_store.Item{}, errors.New("some internal error in DB"))
	for _, endpoint := range endpoints {
		t.Run(endpoint+" returns 500 on item store error", func(t *testing.T) {
			doGetToEndpoint(t, server, endpoint, http.StatusInternalServerError)
		})
	}
}

func TestPostItems(t *testing.T) {

	t.Run("POST"+itemsEndpoint+" should return the added item", func(t *testing.T) {
		todoServer, _ := setupTestServer(t, []item_store.Item{}, nil)
		title := "item title"
		payload := todo_server.AddItemRequest{
			Title: &title,
		}

		result := doRequestToEndpoint(t, todoServer, itemsEndpoint, http.MethodPost, payload, http.StatusOK)
		item := decodeItem(t, result)
		if title != item.Title {
			t.Fatalf("POST returned the wrong title, wanted %q, got %q", title, item.Title)
		}
	})

	t.Run("POST"+itemsEndpoint+" should return call item store add item method", func(t *testing.T) {
		todoServer, store := setupTestServer(t, []item_store.Item{}, nil)
		title := "item title"
		payload := todo_server.AddItemRequest{
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
	t.Run("PUT"+itemsEndpointWithID1+" should return the edited item", func(t *testing.T) {

		todoServer, _ := setupTestServer(t, initialItems, nil)
		newTitle := "new item title"
		done := false
		archived := false
		payload := todo_server.EditItemRequest{
			Title:    newTitle,
			Done:     &done,
			Archived: &archived,
		}

		result := doRequestToEndpoint(t, todoServer, itemsEndpointWithID1, http.MethodPut, payload, http.StatusOK)
		item := decodeItem(t, result)
		if newTitle != item.Title {
			t.Fatalf("PUT returned the wrong title, wanted %q, got %q", newTitle, item.Title)
		}
	})

	t.Run("PUT"+itemsEndpointWithID1+" should return call item store edit item", func(t *testing.T) {
		todoServer, store := setupTestServer(t, []item_store.Item{}, nil)
		title := "item title"
		done := false
		archived := false
		payload := todo_server.EditItemRequest{
			Title:    title,
			Done:     &done,
			Archived: &archived,
		}

		doRequestToEndpoint(t, todoServer, itemsEndpointWithID1, http.MethodPut, payload, http.StatusOK)

		timesCalled := len(store.EditItemCalledWith)
		if timesCalled != 1 {
			t.Fatalf("Edit item was not called the right amount of times, wanted 1, got %v", timesCalled)
		}
		arg := store.EditItemCalledWith[0]
		if arg.Title != title {
			t.Fatalf("Edit item was not called with the right argument, wanted %q, got %v", title, arg)
		}
	})

	t.Run("PUT "+itemsEndpointWithID1+" should return 400 on invalid data", func(t *testing.T) {

		todoServer, _ := setupTestServer(t, []item_store.Item{}, nil)
		title := "item title"
		payload := todo_server.EditItemRequest{
			Title: title,
		}

		doRequestToEndpoint(t, todoServer, itemsEndpointWithID1, http.MethodPut, payload, http.StatusBadRequest)
	})
	t.Run("PUT "+itemsEndpointWithID1+" should return 404 on non-existent item id", func(t *testing.T) {

		todoServer, _ := setupTestServer(t, []item_store.Item{}, item_store.ErrItemNotFound)
		title := "item title"
		done := false
		archived := false
		payload := todo_server.EditItemRequest{
			Title:    title,
			Done:     &done,
			Archived: &archived,
		}

		doRequestToEndpoint(t, todoServer, itemsEndpointWithID1, http.MethodPut, payload, http.StatusNotFound)
	})
}

func TestArchiveDoneItems(t *testing.T) {
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
	t.Run("POST "+archiveDoneItems+" should call archiveDoneItems", func(t *testing.T) {
		todoServer, store := setupTestServer(t, initialItems, nil)

		doRequestToEndpoint(t, todoServer, archiveDoneItems, http.MethodPost, nil, http.StatusOK)

		calledTimes := store.ArchiveDoneItemsCalledTimes
		if calledTimes != 1 {
			t.Fatalf("ArchiveDoneItems was not called the right amount of times, wanted 1, got %v", calledTimes)
		}
	})
}

func TestDeleteItem(t *testing.T) {
	initialItems := []item_store.Item{
		{
			ID:       1,
			Title:    "title",
			Done:     false,
			Archived: false,
		},
	}
	t.Run("DELETE "+itemsEndpointWithID1+" should call delete item store function", func(t *testing.T) {
		todoServer, store := setupTestServer(t, initialItems, nil)

		doRequestToEndpoint(t, todoServer, itemsEndpointWithID1, http.MethodDelete, nil, http.StatusOK)

		calledWith := store.DeleteItemCalledWith
		if calledTimes := len(calledWith); calledTimes != 1 {
			t.Fatalf("delete item store function was not called the right amount of times, wanted 1, got %v", calledTimes)
		}
		if firstCall := calledWith[0]; firstCall != 1 {
			t.Fatalf("Edit item was not called with the right argument, wanted 1, got %v", firstCall)
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

func doGetToEndpoint(t testing.TB, server *todo_server.TodoServer, endpoint string, expectedCode int) *http.Response {
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

func doRequestToEndpoint(t testing.TB, server *todo_server.TodoServer, endpoint string, method string, payload any, expectedCode int) *http.Response {
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
	todoServer := todo_server.NewTodoServer(&itemStore)
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
