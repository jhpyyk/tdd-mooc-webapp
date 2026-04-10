import type { TodoItemData } from "../types";

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

    doPost = async (endpoint: string, body: object) => {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            console.error(res.url, res.status, res.statusText);
            throw new Error(res.url + res.status + res.statusText);
        }
        return res;
    };

    getAllItems = async () => {
        const res = await this.doGet("/items");
        const data = await res.json();
        return data;
    };

    getActiveItems = async () => {
        const res = await this.doGet("/items?archived=false");
        const data = await res.json();
        return data;
    };

    getArchivedItems = async () => {
        const res = await this.doGet("/items?archived=true");
        const data = await res.json();
        return data;
    };

    addItem = async (title: string) => {
        const res = await this.doPost("/items", { title: title });
        const data = await res.json();
        return data;
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
