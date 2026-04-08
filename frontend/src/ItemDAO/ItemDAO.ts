import type { TodoItemData, TodoItemDataNoId } from "../types";

export interface ItemDAO {
    getAllItems: () => Promise<TodoItemData[]>;
    getActiveItems: () => Promise<TodoItemData[]>;
    getArchivedItems: () => Promise<TodoItemData[]>;
    addItem: (itemNoId: TodoItemDataNoId) => Promise<TodoItemData>;
    editItem: (item: TodoItemData) => Promise<TodoItemData>;
    archiveDoneItems: () => Promise<void>;
    deleteItem: (itemId: number) => Promise<void>;
}

export class ItemDAOImpl implements ItemDAO {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getAllItems = async () => {
        const res = await fetch(`${this.baseUrl}/items`);
        const data = await res.json();
        return data;
    };
    getActiveItems = () => {
        throw new Error("not implemented");
    };
    getArchivedItems = () => {
        throw new Error("not implemented");
    };
    addItem = () => {
        throw new Error("not implemented");
    };
    editItem = () => {
        throw new Error("not implemented");
    };
    archiveDoneItems = () => {
        throw new Error("not implemented");
    };
    deleteItem = () => {
        throw new Error("not implemented");
    };
}
