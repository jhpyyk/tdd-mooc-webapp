package todo_server

import (
	"net/http"
)

func (*TodoServer) testHandler(w http.ResponseWriter, _ *http.Request) {
	writeTestMessageResponse(w, "Hello from go backend")
}

func (h *TodoServer) dbHealthHandler(w http.ResponseWriter, _ *http.Request) {
	healthString := h.store.GetDbHealthString()
	writeTestMessageResponse(w, healthString)
}
