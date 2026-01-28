import { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../ItemList/ItemList";
import type { TodoItemData } from "../../types";
import "./TodoPage.css";

const items: TodoItemData[] = [
    {
        id: 1,
        title: "item title",
    },
    {
        id: 2,
        title: "item title",
    },
];

const TodoPage = () => {
    const [itemData, setItemData] = useState<TodoItemData[]>(items);

    const addItem = (newItem: TodoItemData) => {
        const newItems = [...itemData, newItem];
        setItemData(newItems);
    };

    const editItem = (newItem: TodoItemData) => {};

    return (
        <div className="todo-page-container">
            <AddItemForm titleInitialValue="" submitOnClick={addItem} />
            <ItemList itemData={itemData} editItem={editItem} />
        </div>
    );
};

export default TodoPage;
