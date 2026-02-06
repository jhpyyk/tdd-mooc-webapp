import { useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../ItemList/ItemList";
import type { TodoItemData, TodoItemDataNoId } from "../../types";
import "./TodoPage.css";
import { type ItemDAO } from "../../ItemDAO";

interface TodoPageProps {
    itemDAO: ItemDAO;
}

const TodoPage = ({ itemDAO }: TodoPageProps) => {
    const [itemData, setItemData] = useState<TodoItemData[]>(
        itemDAO.getActiveItems()
    );

    const addItem = (itemToAdd: TodoItemDataNoId) => {
        const itemWithId = itemDAO.addItem(itemToAdd);
        const newItems = [...itemData, itemWithId];
        setItemData(newItems);
    };

    const editItem = (itemToEdit: TodoItemData) => {
        const newItem = itemDAO.editItem(itemToEdit);
        const newItems = itemData.map((item) => {
            if (item.id === newItem.id) {
                return newItem;
            }
            return item;
        });
        setItemData(newItems);
    };

    const archiveDoneItems = () => {
        itemDAO.archiveDoneItems();
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
