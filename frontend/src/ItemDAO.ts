import type { TodoItemData } from "./types";

const itemData: TodoItemData[] = [
    {
        id: 1,
        title: "item title",
        done: false,
    },
    {
        id: 2,
        title: "item title",
        done: false,
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
}

export class LocalItemDAO implements ItemDAO {
    getItems = () => {
        return itemData;
    };
}
