package todo_server

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

type TodoServer struct {
	store item_store.ItemStore
	http.Handler
}

type TestMessage struct {
	Message string `json:"message"`
}

type AddItemRequest struct {
	Title *string `json:"title"`
}

type EditItemRequest struct {
	Title    string `json:"title"`
	Done     *bool  `json:"done"`
	Archived *bool  `json:"archived"`
}

func (r *EditItemRequest) Validate() error {
	if strings.TrimSpace(r.Title) == "" {
		return errors.New("title is required")
	}
	if r.Done == nil {
		return errors.New("done is required")
	}
	if r.Archived == nil {
		return errors.New("archived is required")
	}
	return nil
}

func (r *EditItemRequest) ToItem(id int) item_store.Item {
	item := item_store.Item{
		ID:       id,
		Title:    r.Title,
		Done:     *r.Done,
		Archived: *r.Archived,
	}
	return item
}

func NewTodoServer(itemStore item_store.ItemStore) *TodoServer {
	server := new(TodoServer)
	server.store = itemStore

	router := http.NewServeMux()

	router.Handle("/test", http.HandlerFunc(server.testHandler))
	router.Handle("/db-health", http.HandlerFunc(server.dbHealthHandler))
	router.Handle("/items", http.HandlerFunc(server.itemsRouteHandler))
	router.Handle("/items/{id}", http.HandlerFunc(server.itemByIdHandler))
	router.Handle("/archive-done", http.HandlerFunc(server.archiveDoneItemsHandler))

	server.Handler = corsMiddleware(router)

	return server
}

func (server *TodoServer) itemsRouteHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		itemsGetHandler(server.store, w, r)
	case http.MethodPost:
		itemsPostHandler(server.store, w, r)
	}
}

func (server *TodoServer) itemByIdHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPut:
		itemsPutHandler(server.store, w, r)
	case http.MethodDelete:
		itemsDeleteHandler(server.store, w, r)
	}
}

func itemsGetHandler(store item_store.ItemStore, w http.ResponseWriter, r *http.Request) {
	archived := r.URL.Query().Get("archived")
	switch archived {
	case "false":
		items, err := store.GetAllActiveItems()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		writeItemSliceResponse(w, items)
	case "true":

		items, err := store.GetAllArchivedItems()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		writeItemSliceResponse(w, items)
	default:
		items, err := store.GetAllItems()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		writeItemSliceResponse(w, items)
	}
}

func itemsPostHandler(store item_store.ItemStore, w http.ResponseWriter, r *http.Request) {
	decoded := new(AddItemRequest)
	if err := json.NewDecoder(r.Body).Decode(decoded); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	if decoded.Title == nil || *decoded.Title == "" {
		http.Error(w, "title is required", http.StatusBadRequest)
		return
	}

	item, err := store.AddItem(*decoded.Title)
	if err != nil {
		http.Error(w, "failed to add item", http.StatusInternalServerError)
		return
	}
	writeItemResponse(w, item)
}

func itemsPutHandler(store item_store.ItemStore, w http.ResponseWriter, r *http.Request) {
	req, ok := mustDecodeAndValidateEditItemRequest(w, r)
	if !ok {
		return
	}

	id, ok := mustParsePathID(w, r, "id")
	if !ok {
		return
	}

	item, err := store.EditItem(req.ToItem(id))
	if err != nil {
		if errors.Is(err, item_store.ErrItemNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		http.Error(w, "failed to edit item in DB", http.StatusInternalServerError)
		return
	}

	writeItemResponse(w, item)
}

func itemsDeleteHandler(store item_store.ItemStore, w http.ResponseWriter, r *http.Request) {
	id, ok := mustParsePathID(w, r, "id")
	if !ok {
		return
	}
	err := store.DeleteItem(id)
	if err != nil {
		if errors.Is(err, item_store.ErrItemNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
		}
		http.Error(w, "failed to edit item in DB", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func mustDecodeAndValidateEditItemRequest(w http.ResponseWriter, r *http.Request) (*EditItemRequest, bool) {
	var req EditItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return nil, false
	}
	if err := req.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return nil, false
	}
	return &req, true
}

func mustParsePathID(w http.ResponseWriter, r *http.Request, key string) (int, bool) {
	id, err := strconv.Atoi(r.PathValue(key))
	if err != nil || id <= 0 {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return 0, false
	}
	return id, true
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

func (*TodoServer) testHandler(w http.ResponseWriter, _ *http.Request) {
	writeTestMessageResponse(w, "Hello from go backend")
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
