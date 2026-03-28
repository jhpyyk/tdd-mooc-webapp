package item_store_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	helpers "github.com/jhpyyk/tdd-mooc-webapp/backend-go/test_helpers"
	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

func setupStore(t testing.TB) (*item_store.ItemStoreImpl, []item_store.Item) {
	store := item_store.NewItemStore()
	items := []item_store.Item{
		{
			ID:       1,
			Title:    "title1",
			Done:     false,
			Archived: false,
		},
		{
			ID:       2,
			Title:    "title1",
			Done:     false,
			Archived: false,
		},
	}
	for _, item := range items {
		_, err := store.DB.Exec(
			`
				insert into todo_items (title, done, archived)
				values ($1, $2, $3)
				`,
			item.Title, item.Done, item.Archived,
		)
		if err != nil {
			t.Fatalf("setup insert failed %v", err)
		}
	}
	return store, items
}

func TestItemStoreIntegrationSetup(t *testing.T) {
	helpers.IntegrationTest(t)
	store, initialItems := setupStore(t)

	t.Cleanup(func() {
		_, _ = store.DB.Exec(`TRUNCATE TABLE todo_items RESTART IDENTITY`)
	})

	t.Run("Test ItemStoreImpl health check", func(t *testing.T) {
		dbHealthString := store.GetDbHealthString()
		expected := "Go DB connection is healthy"
		if dbHealthString != expected {
			t.Errorf("Health check string does not match. Got %q, expected %q", dbHealthString, expected)
		}
	})

	t.Run("Test setup function", func(t *testing.T) {
		rows, err := store.DB.Query(
			`
			select * from todo_items
			`,
		)
		if err != nil {
			t.Fatalf("error in item store  test setup %q", err.Error())
		}
		items, err := item_store.ScanRowsToItems(rows)
		if err != nil {
			t.Fatalf("error in item store test setup, %q", err.Error())
		}

		helpers.AssertItemsEqual(t, initialItems, items)

	})
}

func TestItemStoreIntegrationGetItems(t *testing.T) {
	helpers.IntegrationTest(t)
	store, initialItems := setupStore(t)

	t.Run("Test get all items should return all items", func(t *testing.T) {
		items, err := store.GetAllItems()
		if err != nil {
			t.Fatalf("error getting all items %q", err)
		}
		helpers.AssertItemsEqual(t, initialItems, items)
	})
}

func TestGetBackendE2ETestString(t *testing.T) {
	helpers.IntegrationTest(t)
	itemStore := item_store.NewItemStore()
	todoServer := todo_server.NewTodoServer(itemStore)
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
