import type { TodoItemData, TodoItemDataNoId } from "./types";

export interface ItemDAO {
    getActiveItems: () => Promise<TodoItemData[]>;
    getArchivedItems: () => Promise<TodoItemData[]>;
    addItem: (itemNoId: TodoItemDataNoId) => Promise<TodoItemData>;
    editItem: (item: TodoItemData) => Promise<TodoItemData>;
    archiveDoneItems: () => Promise<void>;
    deleteItem: (itemId: number) => Promise<void>;
}
