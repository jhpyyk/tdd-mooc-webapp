package main_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	server "github.com/jhpyyk/tdd-mooc-webapp/backend-go"
)

func TestGetBackendE2ETestString(t *testing.T) {
	t.Run("should return backend e2e test string", func(t *testing.T) {
		request, _ := http.NewRequest(http.MethodGet, "/test", nil)
		response := httptest.NewRecorder()

		server.TodoServer(response, request)

		got := response.Body.String()
		want := "Hello from go backend"

		if got != want {
			t.Errorf("got %q, want %q", got, want)
		}
	})
}
