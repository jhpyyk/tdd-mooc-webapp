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
    getItems: () => TodoItemData[];
    addItem: (itemNoId: TodoItemDataNoId) => TodoItemData;
    editItem: (item: TodoItemData) => TodoItemData;
    archiveDoneItems: () => void;
}

export class LocalItemDAO implements ItemDAO {
    itemData: TodoItemData[];

    constructor(initialItems: TodoItemData[] = itemData) {
        this.itemData = initialItems;
    }
    getItems = () => {
        return this.itemData;
    };
    addItem = (newItem: TodoItemDataNoId): TodoItemData => {
        const id = nextId();
        const itemWithId: TodoItemData = {
            ...newItem,
            id: id,
        };
        this.itemData = this.itemData.concat(itemWithId);
        return itemWithId;
    };

    editItem = (itemToEdit: TodoItemData): TodoItemData => {
        const newItems = this.itemData.map((item) => {
            if (item.id === itemToEdit.id) {
                return itemToEdit;
            }
            return item;
        });
        this.itemData = newItems;

        return itemToEdit;
    };
    archiveDoneItems = () => {
        const filtered = this.itemData.filter((item) => !item.done);
        this.itemData = filtered;
    };
}
