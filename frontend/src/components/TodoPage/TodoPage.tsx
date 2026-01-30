import { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../ItemList/ItemList";
import type { TodoItemData, TodoItemDataNoId } from "../../types";
import "./TodoPage.css";

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
const getId = () => {
    id += 1;
    console.log(id);
    return id;
};

interface TodoPageProps {
    initialItems?: TodoItemData[];
}

const TodoPage = ({ initialItems = itemData }: TodoPageProps) => {
    const [itemData, setItemData] = useState<TodoItemData[]>(initialItems);

    const addItem = (newItem: TodoItemDataNoId) => {
        const id = getId();
        const itemWithId: TodoItemData = {
            ...newItem,
            id: id,
        };
        const newItems = [...itemData, itemWithId];
        setItemData(newItems);
    };

    const editItem = (newItem: TodoItemData) => {};

    const archiveDoneItems = () => {
        const filtered = itemData.filter((item) => item.done);
        setItemData(filtered);
    };

    return (
        <div className="todo-page-container">
            <AddItemForm titleInitialValue="" submitOnClick={addItem} />
            <ItemList itemData={itemData} editItem={editItem} />
            <button onClick={archiveDoneItems}>Archive done items</button>
        </div>
    );
};

export default TodoPage;
