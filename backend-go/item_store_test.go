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
func TestItemStore(t *testing.T) {
	t.Run("Test ItemStore health check", func(t *testing.T) {
		IntegrationTest(t)
		itemStore := store.ItemStore{}
		dbHealthString := itemStore.GetDbHealthString()
		expected := "DB connection is healthy"
		if dbHealthString != expected {

			t.Errorf("Health check string does not match. Got %q, expected %q", dbHealthString, expected)
		}
	})
}
