import { vi } from "vitest";
import type { ItemDAO } from "./ItemDAO";
import type { TodoItemData } from "./types";

export class MockDAO implements ItemDAO {
    itemData: TodoItemData[];
    delay: number;

    constructor(initialItems: TodoItemData[], delay = 0) {
        this.itemData = initialItems;
        this.delay = delay;
    }
    addItem = vi.fn();
    editItem = vi.fn();
    archiveDoneItems = vi.fn();
    deleteItem = vi.fn();

    getActiveItems = async () => {
        await new Promise((r) => setTimeout(r, this.delay));
        const items = this.itemData.filter((item) => {
            return !item.archived;
        });
        return items;
    };
    getArchivedItems = async () => {
        await new Promise((r) => setTimeout(r, this.delay));
        const items = this.itemData.filter((item) => {
            return item.archived;
        });
        return items;
    };
}
