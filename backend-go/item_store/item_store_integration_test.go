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
			Archived: true,
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

func storeTearDown(t testing.TB, store *item_store.ItemStoreImpl) {
	t.Cleanup(func() {
		_, _ = store.DB.Exec(`TRUNCATE TABLE todo_items RESTART IDENTITY`)
	})
}

func TestItemStoreIntegrationSetup(t *testing.T) {
	helpers.IntegrationTest(t)
	store, initialItems := setupStore(t)
	storeTearDown(t, store)

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
			t.Fatalf("error in item store test setup %q", err.Error())
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

	t.Run("Test get all active items should return all items that are not archived", func(t *testing.T) {
		items, err := store.GetAllActiveItems()
		if err != nil {
			t.Fatalf("error getting all active items %q", err)
		}
		want := []item_store.Item{initialItems[0]}
		helpers.AssertItemsEqual(t, want, items)
	})

	t.Run("Test get all archived items should return all items that are archived", func(t *testing.T) {
		items, err := store.GetAllArchivedItems()
		if err != nil {
			t.Fatalf("error getting all archived items %q", err)
		}
		want := []item_store.Item{initialItems[1]}
		helpers.AssertItemsEqual(t, want, items)
	})
}

func TestItemStoreIntegrationAddItem(t *testing.T) {
	helpers.IntegrationTest(t)
	store, _ := setupStore(t)
	storeTearDown(t, store)

	t.Run("should return an item with the title", func(t *testing.T) {
		title := "added item"
		item := addItemHelper(t, store)
		if item.Title != title {
			t.Fatalf("returned title has incorrect title, wanted %v, got %v", title, item.Title)
		}
	})
	t.Run("should return an item with done == false", func(t *testing.T) {
		item := addItemHelper(t, store)
		if item.Done != false {
			t.Fatalf("returned 'done' has incorrect value, wanted %v, got %v", item.Done, false)
		}
	})
	t.Run("should return an item with archived == false", func(t *testing.T) {
		item := addItemHelper(t, store)
		if item.Done != false {
			t.Fatalf("returned 'archived' has incorrect value, wanted %v, got %v", item.Archived, false)
		}
	})
}

func addItemHelper(t testing.TB, store *item_store.ItemStoreImpl) item_store.Item {
	t.Helper()
	title := "added item"
	item, err := store.AddItem(title)
	if err != nil {
		t.Fatalf("error adding item %q", err.Error())
	}
	return item
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
