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

    doFetch = async (endpoint: string) => {
        const res = await fetch(`${this.baseUrl}${endpoint}`);
        if (res.status != 200) {
            console.error(
                "error fetching all items",
                res.url,
                res.status,
                res.statusText
            );
            throw new Error(res.statusText);
        }
        return res;
    };

    getAllItems = async () => {
        const res = await this.doFetch("/items");
        const data = await res.json();
        return data;
    };

    getActiveItems = async () => {
        const res = await this.doFetch("/items?archived=false");
        const data = await res.json();
        return data;
    };

    getArchivedItems = async () => {
        const res = await fetch(`${this.baseUrl}/items?archived=true`);
        const data = await res.json();
        return data;
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
