package todo_server_test

import (
	"testing"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/todo_server"
)

type ItemStoreStub struct {
	items                       []item_store.Item
	throwError                  error
	AddItemCalledWith           []string
	EditItemCalledWith          []item_store.Item
	ArchiveDoneItemsCalledTimes int
	DeleteItemCalledWith        []int
}

func newItemStoreStub(items []item_store.Item, throwError error) *ItemStoreStub {
	stub := ItemStoreStub{}
	stub.items = items
	stub.throwError = throwError
	return &stub
}

func (store *ItemStoreStub) GetAllItems() ([]item_store.Item, error) {
	if store.throwError != nil {
		return nil, store.throwError
	}
	return store.items, nil
}

func (store *ItemStoreStub) GetAllActiveItems() ([]item_store.Item, error) {
	if store.throwError != nil {
		return nil, store.throwError
	}
	return []item_store.Item{store.items[0]}, nil
}

func (store *ItemStoreStub) GetAllArchivedItems() ([]item_store.Item, error) {
	if store.throwError != nil {
		return nil, store.throwError
	}
	return []item_store.Item{store.items[1]}, nil
}

func (store *ItemStoreStub) AddItem(title string) (item_store.Item, error) {
	store.AddItemCalledWith = append(store.AddItemCalledWith, title)
	if store.throwError != nil {
		return item_store.Item{}, store.throwError
	}
	item := item_store.Item{
		ID:       999,
		Title:    title,
		Done:     false,
		Archived: false,
	}
	return item, nil
}

func (store *ItemStoreStub) EditItem(item item_store.Item) (item_store.Item, error) {
	store.EditItemCalledWith = append(store.EditItemCalledWith, item)
	if store.throwError != nil {
		return item_store.Item{}, store.throwError
	}
	return item, nil
}

func (store *ItemStoreStub) DeleteItem(id int) error {
	store.DeleteItemCalledWith = append(store.DeleteItemCalledWith, id)
	if store.throwError != nil {
		return store.throwError
	}
	return nil
}

func (store *ItemStoreStub) ArchiveDoneItems() error {
	store.ArchiveDoneItemsCalledTimes += 1
	if store.throwError != nil {
		return store.throwError
	}
	return nil
}

func (store *ItemStoreStub) GetDbHealthString() string {
	return ""
}

func setupTestServer(t testing.TB, items []item_store.Item, throwError error) (*todo_server.TodoServer, *ItemStoreStub) {
	t.Helper()

	itemStore := newItemStoreStub(items, throwError)
	todoServer := todo_server.NewTodoServer(itemStore)
	return todoServer, itemStore
}
