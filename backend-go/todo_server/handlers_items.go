package todo_server

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

func itemsGetHandler(w http.ResponseWriter, r *http.Request, store item_store.ItemStore) {
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

func itemsPostHandler(w http.ResponseWriter, r *http.Request, store item_store.ItemStore) {
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

func itemByIdPutHandler(w http.ResponseWriter, r *http.Request, store item_store.ItemStore, id int) {
	req, ok := mustDecodeAndValidateEditItemRequest(w, r)
	if !ok {
		return
	}

	item, err := store.EditItem(req.ToItem(id))
	if err != nil {
		if errors.Is(err, item_store.ErrItemNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, "failed to edit item in DB", http.StatusInternalServerError)
		return
	}

	writeItemResponse(w, item)
}

func itemByIdDeleteHandler(w http.ResponseWriter, r *http.Request, store item_store.ItemStore, id int) {
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
