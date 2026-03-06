package item_store_test

import (
	"testing"

	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	helpers "github.com/jhpyyk/tdd-mooc-webapp/backend-go/test_helpers"
)

func TestItemStoreIntegration(t *testing.T) {
	itemStore := store.ItemStoreImpl{}
	t.Run("Test ItemStoreImpl health check", func(t *testing.T) {
		helpers.IntegrationTest(t)
		dbHealthString := itemStore.GetDbHealthString()
		expected := "Go DB connection is healthy"
		if dbHealthString != expected {
			t.Errorf("Health check string does not match. Got %q, expected %q", dbHealthString, expected)
		}
	})
}
