package todo_server

import (
	"errors"
	"strings"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

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
