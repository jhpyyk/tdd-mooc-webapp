package main

type ItemStore struct {
}

func (store ItemStore) GetDbHealthString() string {
	return "DB connection is healthy"
}
