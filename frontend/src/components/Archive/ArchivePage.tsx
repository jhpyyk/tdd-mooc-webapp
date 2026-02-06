import { useEffect, useState } from "react";
import type { ItemDAO } from "../../ItemDAO";
import ItemList from "../items/ItemList/ItemList";
import type { TodoItemData } from "../../types";
import { Link } from "wouter";

interface ArchivePageProps {
    itemDAO: ItemDAO;
}
const ArchivePage = ({ itemDAO }: ArchivePageProps) => {
    const [itemData, setItemData] = useState<TodoItemData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const items = await itemDAO.getArchivedItems();
            setItemData(items);
        };
        fetchData();
    }, [itemDAO]);

    const deleteItem = (itemToDelete: TodoItemData) => {
        itemDAO.deleteItem(itemToDelete);
        const filtered = itemData.filter((item) => {
            return item.id !== itemToDelete.id;
        });
        setItemData(filtered);
    };
    return (
        <div>
            <Link href="/todo">Todo</Link>
            <h2>Archive</h2>
            <ItemList itemData={itemData} buttonOnClick={deleteItem} archived />
        </div>
    );
};

export default ArchivePage;
