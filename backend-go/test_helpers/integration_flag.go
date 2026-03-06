package test_helpers

import (
	"os"
	"testing"
)

func IntegrationTest(t *testing.T) {
	t.Helper()
	if os.Getenv("INTEGRATION_TEST") == "" {
		t.Skip("skipping integration tests, set environment variable INTEGRATION_TEST")
	}
}
