package item_store

import (
	"database/sql"
	"errors"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Item struct {
	ID       int
	Title    string
	Done     bool
	Archived bool
}

var ErrItemNotFound = errors.New("item not found")

type ItemStore interface {
	GetDbHealthString() string
	GetAllItems() ([]Item, error)
	GetAllActiveItems() ([]Item, error)
	GetAllArchivedItems() ([]Item, error)
	AddItem(title string) (Item, error)
	EditItem(Item) (Item, error)
	DeleteItem(id int) error
	ArchiveDoneItems() error
}

type ItemStoreImpl struct {
	items []Item
	DB    *sql.DB
}

func NewItemStore() *ItemStoreImpl {
	store := ItemStoreImpl{}

	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		log.Fatal("TEST_DATABASE_URL not set")
	}
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Error opening db connectio %v", err)
	}
	store.DB = db

	return &store
}

func (store *ItemStoreImpl) GetDbHealthString() string {
	_, err := store.DB.Exec("SELECT 1")
	if err != nil {
		log.Fatal(err)
	}

	return "Go DB connection is healthy"
}

func (store *ItemStoreImpl) GetAllItems() ([]Item, error) {
	rows, err := store.DB.Query(
		`
		select * from todo_items
		`,
	)
	if err != nil {
		return nil, err
	}
	items, err := ScanRowsToItems(rows)
	return items, err
}

func (store *ItemStoreImpl) GetAllActiveItems() ([]Item, error) {
	rows, err := store.DB.Query(
		`
			select * from todo_items
			where archived = false
			`,
	)
	if err != nil {
		return nil, err
	}
	items, err := ScanRowsToItems(rows)
	return items, err
}

func (store *ItemStoreImpl) GetAllArchivedItems() ([]Item, error) {
	rows, err := store.DB.Query(
		`
			select * from todo_items
			where archived = true
			`,
	)
	if err != nil {
		return nil, err
	}
	items, err := ScanRowsToItems(rows)
	return items, err
}

func (store *ItemStoreImpl) AddItem(title string) (Item, error) {
	row := store.DB.QueryRow(
		`
		insert into todo_items (title)
		values ($1)
		returning id, title, done, archived
		`,
		title,
	)
	item, err := ScanRowToItem(row)
	return item, err
}

func (store *ItemStoreImpl) EditItem(editedItem Item) (Item, error) {
	row := store.DB.QueryRow(
		`
		update todo_items
			set title = ($2), done = ($3), archived = ($4)
			where id = ($1)
			returning id, title, done, archived
		`,
		editedItem.ID, editedItem.Title, editedItem.Done, editedItem.Archived,
	)
	item, err := ScanRowToItem(row)
	if errors.Is(err, sql.ErrNoRows) {
		return item, ErrItemNotFound
	}
	return item, err
}

func (store *ItemStoreImpl) ArchiveDoneItems() error {
	panic("not implemented")
}

func (store *ItemStoreImpl) DeleteItem(id int) error {
	panic("not implemented")
}

func ScanRowsToItems(rows *sql.Rows) ([]Item, error) {
	items := []Item{}
	for rows.Next() {
		var item Item
		err := rows.Scan(&item.ID, &item.Title, &item.Done, &item.Archived)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

func ScanRowToItem(row *sql.Row) (Item, error) {
	var item Item
	err := row.Scan(&item.ID, &item.Title, &item.Done, &item.Archived)
	return item, err
}
