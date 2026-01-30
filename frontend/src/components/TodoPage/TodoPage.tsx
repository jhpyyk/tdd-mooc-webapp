import { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../ItemList/ItemList";
import type { TodoItemData, TodoItemDataNoId } from "../../types";
import "./TodoPage.css";
import { LocalItemDAO, type ItemDAO } from "../../ItemDAO";

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
    itemDAO: ItemDAO;
}

const localItemDAO = new LocalItemDAO();

const TodoPage = ({ itemDAO = localItemDAO }: TodoPageProps) => {
    const [itemData, setItemData] = useState<TodoItemData[]>(
        itemDAO.getItems()
    );

    const addItem = (newItem: TodoItemDataNoId) => {
        const itemWithId = itemDAO.addItem(newItem);
        const newItems = [...itemData, itemWithId];
        setItemData(newItems);
    };

    const editItem = (newItem: TodoItemData) => {
        const newItems = itemData.map((item) => {
            if (item.id === newItem.id) {
                return newItem;
            }
            return item;
        });
        setItemData(newItems);
    };

    const archiveDoneItems = () => {
        const filtered = itemData.filter((item) => !item.done);
        setItemData(filtered);
    };

    return (
        <div className="todo-page-container">
            <AddItemForm titleInitialValue="" submitOnClick={addItem} />
            <ItemList itemData={itemData} editItem={editItem} />
            <button
                disabled={!itemData.some((item) => item.done)}
                onClick={archiveDoneItems}
            >
                Archive done items
            </button>
        </div>
    );
};

export default TodoPage;
