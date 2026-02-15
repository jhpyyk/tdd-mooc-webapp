package main_test

import (
	"testing"

	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go"
)

func TestItemStoreInMemory(t *testing.T) {
	itemStore := store.ItemStoreInMemory{}

	t.Run("Test ItemStoreInMemory health check", func(t *testing.T) {
		dbHealthString := itemStore.GetDbHealthString()
		expected := "In memory item store connection is healthy"
		if dbHealthString != expected {
			t.Errorf("Health check string does not match. Got %q, expected %q", dbHealthString, expected)
		}
	})
}
