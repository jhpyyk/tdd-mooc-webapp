import { useEffect, useOptimistic, useState, useTransition } from "react";
import AddItemForm from "../AddItemForm/AddItemForm";
import ItemList from "../items/ItemList/ItemList";
import type { TodoItemData, TodoItemDataNoId } from "../../types";
import { type ItemDAO } from "../../ItemDAO";
import { Link } from "wouter";

interface TodoPageProps {
    itemDAO: ItemDAO;
}

type ItemOperation =
    | { item: TodoItemData; type: "add" }
    | { item: TodoItemData; type: "delete" };

const itemReducer = (itemData: TodoItemData[], operation: ItemOperation) => {
    if (operation.type === "add") {
        const newItems = [...itemData, operation.item];
        return newItems;
    }
    return itemData;
};

const TodoPage = ({ itemDAO }: TodoPageProps) => {
    const [isPending, startTransition] = useTransition();
    const [itemData, setItemData] = useState<TodoItemData[]>([]);
    const [optimisticItems, addOptimisticItem] = useOptimistic<
        TodoItemData[],
        ItemOperation
    >(itemData, itemReducer);

    useEffect(() => {
        const fetchData = async () => {
            const items = await itemDAO.getActiveItems();
            setItemData(items);
        };
        fetchData();
    }, [itemDAO]);

    const addItemAction = async (itemToAdd: TodoItemDataNoId) => {
        startTransition(async () => {
            const withId: TodoItemData = { ...itemToAdd, id: -1 };
            addOptimisticItem({ item: withId, type: "add" });
            try {
                const returnedItem = await itemDAO.addItem(itemToAdd);
                startTransition(async () => {
                    const newItems = itemReducer(itemData, {
                        item: returnedItem,
                        type: "add",
                    });
                    setItemData(newItems);
                });
            } catch (error) {
                console.log("Error adding an item");
            }
        });
    };

    const editItemAction = async (itemToEdit: TodoItemData) => {
        startTransition(async () => {
            try {
                const newItem = await itemDAO.editItem(itemToEdit);
                const newItems = itemData.map((item) => {
                    if (item.id === newItem.id) {
                        return newItem;
                    }
                    return item;
                });
                setItemData(newItems);
            } catch (error) {
                console.log("Error editing item");
            }
        });
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
                submitOnClick={addItemAction}
                isPending={isPending}
            />
            <ItemList
                itemData={optimisticItems}
                buttonOnClick={editItemAction}
            />
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
