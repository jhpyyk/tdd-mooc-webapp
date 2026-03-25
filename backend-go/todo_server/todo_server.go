package todo_server

import (
	"net/http"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

type TodoServer struct {
	store item_store.ItemStore
	http.Handler
}

func NewTodoServer(itemStore item_store.ItemStore) *TodoServer {
	server := new(TodoServer)
	server.store = itemStore

	router := http.NewServeMux()

	router.Handle("/test", http.HandlerFunc(server.testHandler))
	router.Handle("/db-health", http.HandlerFunc(server.dbHealthHandler))
	router.Handle("/items", http.HandlerFunc(server.itemsRouteHandler))
	router.Handle("/items/{id}", http.HandlerFunc(server.itemByIdRouteHandler))
	router.Handle("/archive-done", http.HandlerFunc(server.archiveDoneItemsHandler))

	server.Handler = corsMiddleware(router)

	return server
}

func (server *TodoServer) itemsRouteHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		itemsGetHandler(w, r, server.store)
	case http.MethodPost:
		itemsPostHandler(w, r, server.store)
	}
}

func (server *TodoServer) itemByIdRouteHandler(w http.ResponseWriter, r *http.Request) {
	id, ok := mustParsePathID(w, r, "id")
	if !ok {
		return
	}
	switch r.Method {
	case http.MethodPut:
		itemsPutHandler(w, r, server.store, id)
	case http.MethodDelete:
		itemsDeleteHandler(w, r, server.store, id)
	}
}

func (server *TodoServer) archiveDoneItemsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST is allowed", http.StatusMethodNotAllowed)
		return
	}

	err := server.store.ArchiveDoneItems()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
