package todo_server

import (
	"encoding/json"
	"net/http"

	item_store "github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

type TodoServer struct {
	store item_store.ItemStore
	http.Handler
}

type TestMessage struct {
	Message string `json:"message"`
}

func NewTodoServer(itemStore item_store.ItemStore) *TodoServer {
	server := new(TodoServer)
	server.store = itemStore

	router := http.NewServeMux()

	router.Handle("/test", http.HandlerFunc(server.testHandler))
	router.Handle("/db-health", http.HandlerFunc(server.dbHealthHandler))
	router.Handle("/active-items", http.HandlerFunc(server.activeItemsHandler))
	router.Handle("/archived-items", http.HandlerFunc(server.archivedItemsHandler))
	router.Handle("/item", http.HandlerFunc(server.itemHandler))
	router.Handle("/archive-done", http.HandlerFunc(server.archiveDoneItemsHandler))

	server.Handler = corsMiddleware(router)

	return server
}

func (server *TodoServer) activeItemsHandler(w http.ResponseWriter, r *http.Request) {
	items := server.store.GetAllActiveItems()
	writeItemSliceResponse(w, items)

}

func (*TodoServer) testHandler(w http.ResponseWriter, _ *http.Request) {
	writeTestMessageResponse(w, "Hello from go backend")
}

func (server *TodoServer) archivedItemsHandler(w http.ResponseWriter, r *http.Request) {
}

func (server *TodoServer) itemHandler(w http.ResponseWriter, r *http.Request) {
}

func (server *TodoServer) archiveDoneItemsHandler(w http.ResponseWriter, r *http.Request) {
}

func (h *TodoServer) dbHealthHandler(w http.ResponseWriter, _ *http.Request) {
	healthString := h.store.GetDbHealthString()
	writeTestMessageResponse(w, healthString)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeTestMessageResponse(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := TestMessage{
		Message: message,
	}
	json.NewEncoder(w).Encode(response)
}

func writeItemResponse(w http.ResponseWriter, item item_store.Item) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(item)
}

func writeItemSliceResponse(w http.ResponseWriter, items []item_store.Item) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(items)
}
