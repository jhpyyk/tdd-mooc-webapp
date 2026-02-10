import { startTransition, useEffect, useOptimistic, useState } from "react";
import type { ItemDAO } from "../../ItemDAO";
import ItemList from "../items/ItemList/ItemList";
import type { TodoItemData } from "../../types";
import { Link } from "wouter";

interface ArchivePageProps {
    itemDAO: ItemDAO;
}

const deleteReducer = (
    itemData: TodoItemData[],
    itemToDelete: TodoItemData
) => {
    const filtered = itemData.filter((item) => {
        return item.id !== itemToDelete.id;
    });
    return filtered;
};

const ArchivePage = ({ itemDAO }: ArchivePageProps) => {
    const [itemData, setItemData] = useState<TodoItemData[]>([]);
    const [optimisticItems, optimisticDeleteReducer] = useOptimistic<
        TodoItemData[],
        TodoItemData
    >(itemData, deleteReducer);

    useEffect(() => {
        const fetchData = async () => {
            const items = await itemDAO.getArchivedItems();
            setItemData(items);
        };
        fetchData();
    }, [itemDAO]);

    const deleteItemAction = async (itemToDelete: TodoItemData) => {
        startTransition(async () => {
            optimisticDeleteReducer(itemToDelete);
            try {
                await itemDAO.deleteItem(itemToDelete);
                const newItems = deleteReducer(itemData, itemToDelete);
                setItemData(newItems);
            } catch (error) {
                console.log("error deleting item");
            }
        });
    };
    return (
        <div>
            <Link href="/todo">Todo</Link>
            <h2>Archive</h2>
            <ItemList
                itemData={optimisticItems}
                buttonOnClick={deleteItemAction}
                archived
            />
        </div>
    );
};

export default ArchivePage;
