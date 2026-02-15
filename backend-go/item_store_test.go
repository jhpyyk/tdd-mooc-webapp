package main_test

import (
	"os"
	"testing"

	store "github.com/jhpyyk/tdd-mooc-webapp/backend-go"
)

func IntegrationTest(t *testing.T) {
	t.Helper()
	if os.Getenv("INTEGRATION_TEST") == "" {
		t.Skip("skipping integration tests, set environment variable INTEGRATION_TEST")
	}
}

func TestItemStoreIntegration(t *testing.T) {
	itemStore := store.ItemStoreImpl{}
	t.Run("Test ItemStoreImpl health check", func(t *testing.T) {
		IntegrationTest(t)
		dbHealthString := itemStore.GetDbHealthString()
		expected := "Go DB connection is healthy"
		if dbHealthString != expected {
			t.Errorf("Health check string does not match. Got %q, expected %q", dbHealthString, expected)
		}
	})
}

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
