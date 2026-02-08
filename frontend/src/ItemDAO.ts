import type { TodoItemData, TodoItemDataNoId } from "./types";

const itemData: TodoItemData[] = [
    {
        id: 1,
        title: "item title",
        done: false,
        archived: false,
    },
    {
        id: 2,
        title: "item title",
        done: false,
        archived: false,
    },
];

let id = itemData.length;
const nextId = () => {
    id += 1;
    console.log(id);
    return id;
};

export interface ItemDAO {
    getActiveItems: () => Promise<TodoItemData[]>;
    getArchivedItems: () => Promise<TodoItemData[]>;
    addItem: (itemNoId: TodoItemDataNoId) => Promise<TodoItemData>;
    editItem: (item: TodoItemData) => Promise<TodoItemData>;
    archiveDoneItems: () => Promise<void>;
    deleteItem: (item: TodoItemData) => Promise<void>;
}

export class LocalItemDAO implements ItemDAO {
    itemData: TodoItemData[];
    delay: number;

    constructor(initialItems: TodoItemData[] = itemData, delay = 0) {
        this.itemData = initialItems;
        this.delay = delay;
    }
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

    addItem = async (newItem: TodoItemDataNoId) => {
        await new Promise((r) => setTimeout(r, this.delay));
        const id = nextId();
        const itemWithId: TodoItemData = {
            ...newItem,
            id: id,
        };
        this.itemData = this.itemData.concat(itemWithId);
        return itemWithId;
    };

    editItem = async (itemToEdit: TodoItemData) => {
        await new Promise((r) => setTimeout(r, this.delay));

        throw new Error("error");
        const newItems = this.itemData.map((item) => {
            if (item.id === itemToEdit.id) {
                return itemToEdit;
            }
            return item;
        });
        this.itemData = newItems;

        return itemToEdit;
    };
    archiveDoneItems = async () => {
        await new Promise((r) => setTimeout(r, this.delay));
        throw new Error("error");
        const newItems = this.itemData.map((item) => {
            if (item.done) {
                const archivedItem = { ...item, archived: true };
                return archivedItem;
            }
            return item;
        });

        this.itemData = newItems;
    };

    deleteItem = async (itemToDelete: TodoItemData) => {
        await new Promise((r) => setTimeout(r, this.delay));
        const newItems = this.itemData.filter((item) => {
            return item.id !== itemToDelete.id;
        });
        this.itemData = newItems;
    };
}
