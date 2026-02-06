import { useEffect, useState } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../items/ItemList/ItemList";
import type { TodoItemData, TodoItemDataNoId } from "../../types";
import { type ItemDAO } from "../../ItemDAO";
import { Link } from "wouter";

interface TodoPageProps {
    itemDAO: ItemDAO;
}

const TodoPage = ({ itemDAO }: TodoPageProps) => {
    const [itemData, setItemData] = useState<TodoItemData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const items = await itemDAO.getActiveItems();
            setItemData(items);
        };
        fetchData();
    }, [itemDAO]);

    const addItem = async (itemToAdd: TodoItemDataNoId) => {
        const itemWithId = await itemDAO.addItem(itemToAdd);
        const newItems = [...itemData, itemWithId];
        setItemData(newItems);
    };

    const editItem = async (itemToEdit: TodoItemData) => {
        const newItem = await itemDAO.editItem(itemToEdit);
        const newItems = itemData.map((item) => {
            if (item.id === newItem.id) {
                return newItem;
            }
            return item;
        });
        setItemData(newItems);
    };

    const archiveDoneItems = async () => {
        await itemDAO.archiveDoneItems();
        const filtered = itemData.filter((item) => !item.done);
        setItemData(filtered);
    };

    return (
        <div>
            <Link href="/archive">Archive</Link>
            <AddItemForm titleInitialValue="" submitOnClick={addItem} />
            <ItemList itemData={itemData} buttonOnClick={editItem} />
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
