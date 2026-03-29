package test_helpers

import (
	"reflect"
	"testing"

	"github.com/jhpyyk/tdd-mooc-webapp/backend-go/item_store"
)

func AssertItemsLength(t testing.TB, items []item_store.Item, wantedLength int) {
	t.Helper()
	if gotLength := len(items); gotLength != wantedLength {
		t.Fatalf("incorrect length of items, wanted %v, got %v", wantedLength, gotLength)
	}
}

func AssertItemSlicesEqual(t testing.TB, wanted, got []item_store.Item) {
	t.Helper()
	if !reflect.DeepEqual(wanted, got) {
		t.Fatalf("items are not equal wanted %v, got %v", wanted, got)
	}
}

func AssertItemsEqual(t testing.TB, wanted, got item_store.Item) {
	t.Helper()
	if !reflect.DeepEqual(wanted, got) {
		t.Fatalf("items are not equal wanted %v, got %v", wanted, got)
	}
}
