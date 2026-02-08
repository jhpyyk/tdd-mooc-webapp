import { useEffect, useOptimistic, useState, useTransition } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../items/ItemList/ItemList";
import type { TodoItemData, TodoItemDataNoId } from "../../types";
import { type ItemDAO } from "../../ItemDAO";
import { Link } from "wouter";

interface TodoPageProps {
    itemDAO: ItemDAO;
}

const addItemReducer = (itemData: TodoItemData[], newItem: TodoItemData) => {
    const newItems = [...itemData, newItem];
    return newItems;
};

const TodoPage = ({ itemDAO }: TodoPageProps) => {
    const [isPending, startTransition] = useTransition();
    const [itemData, setItemData] = useState<TodoItemData[]>([]);
    const [optimisticItems, addOptimisticItem] = useOptimistic<
        TodoItemData[],
        TodoItemData
    >(itemData, addItemReducer);

    useEffect(() => {
        const fetchData = async () => {
            const items = await itemDAO.getActiveItems();
            setItemData(items);
        };
        fetchData();
    }, [itemDAO]);

    const addItem = async (itemToAdd: TodoItemDataNoId) => {
        startTransition(async () => {
            addOptimisticItem({ ...itemToAdd, id: -1 });
            try {
                const itemWithId = await itemDAO.addItem(itemToAdd);
                startTransition(async () => {
                    const newItems = addItemReducer(itemData, itemWithId);
                    setItemData(newItems);
                });
            } catch (error) {
                console.log("Error adding an item");
            }
        });
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
        try {
            await itemDAO.archiveDoneItems();
            const filtered = itemData.filter((item) => !item.done);
            setItemData(filtered);
        } catch (error) {
            console.log("error archiving");
        }
    };

    return (
        <div>
            <Link href="/archive">Archive</Link>
            <AddItemForm
                titleInitialValue=""
                submitOnClick={addItem}
                isPending={isPending}
            />
            <ItemList itemData={optimisticItems} buttonOnClick={editItem} />
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
