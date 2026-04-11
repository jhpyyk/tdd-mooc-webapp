import {
    validateTodoItemData,
    type TodoItemData,
    type TodoItemDataNoId,
} from "../types";

export class InvalidResponseDataError extends Error {}

export interface ItemDAO {
    getAllItems: () => Promise<TodoItemData[]>;
    getActiveItems: () => Promise<TodoItemData[]>;
    getArchivedItems: () => Promise<TodoItemData[]>;
    addItem: (title: string) => Promise<TodoItemData>;
    editItem: (item: TodoItemData) => Promise<TodoItemData>;
    archiveDoneItems: () => Promise<void>;
    deleteItem: (itemId: number) => Promise<void>;
}

export class ItemDAOImpl implements ItemDAO {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    doGet = async (endpoint: string) => {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
        });

        if (!res.ok) {
            console.error(res.url, res.status, res.statusText);
            throw new Error(res.url + res.status + res.statusText);
        }
        return res;
    };

    doFetch = async (endpoint: string, method: string, body: object) => {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: method,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            console.error(res.url, res.status, res.statusText);
            throw new Error(`${res.url}  ${res.status} ${res.statusText}`);
        }
        return res;
    };

    getAllItems = async (): Promise<TodoItemData[]> => {
        const res = await this.doGet("/items");
        const data = await res.json();
        return data;
    };

    getActiveItems = async (): Promise<TodoItemData[]> => {
        const res = await this.doGet("/items?archived=false");
        const data = await res.json();
        return data;
    };

    getArchivedItems = async (): Promise<TodoItemData[]> => {
        const res = await this.doGet("/items?archived=true");
        const data = await res.json();
        return data;
    };

    addItem = async (title: string): Promise<TodoItemData> => {
        const res = await this.doFetch("/items", "POST", { title: title });
        const data = await this.validateItemResponse(res);
        return data;
    };

    editItem = async (editedItem: TodoItemData): Promise<TodoItemData> => {
        const item: TodoItemDataNoId = {
            title: editedItem.title,
            done: editedItem.done,
            archived: editedItem.archived,
        };
        const res = await this.doFetch(`/items/${editedItem.id}`, "PUT", item);
        const data = await this.validateItemResponse(res);
        return data;
    };
    archiveDoneItems = async (): Promise<void> => {
        await this.doFetch(`/archive-done`, "POST", {});
    };

    deleteItem = async (itemId: number): Promise<void> => {
        const res = await fetch(`${this.baseUrl}/items/${itemId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            console.error(res.url, res.status, res.statusText);
            throw new Error(`${res.url}  ${res.status} ${res.statusText}`);
        }
    };

    validateItemResponse = async (res: Response): Promise<TodoItemData> => {
        const data = await res.json();
        const validationErrors = validateTodoItemData(data);

        if (validationErrors.length > 0) {
            throw new InvalidResponseDataError(
                `Error parsing edit item response: ${validationErrors.join("; ")}`,
                data
            );
        }

        return data as TodoItemData;
    };
}
