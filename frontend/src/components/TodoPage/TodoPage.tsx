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
    | { item: TodoItemData; type: "update" }
    | { type: "archive" };

const itemReducer = (itemData: TodoItemData[], operation: ItemOperation) => {
    let newItems = itemData;
    switch (operation.type) {
        case "add":
            newItems = [...itemData, operation.item];
            return newItems;
        case "update":
            newItems = itemData.map((item) => {
                if (item.id === operation.item.id) {
                    return operation.item;
                }
                return item;
            });
            return newItems;
        case "archive":
            newItems = itemData.filter((item) => !item.done);
            return newItems;
        default:
            return newItems;
    }
};

const TodoPage = ({ itemDAO }: TodoPageProps) => {
    const [isPending, startTransition] = useTransition();
    const [itemData, setItemData] = useState<TodoItemData[]>([]);
    const [optimisticItems, optimisticItemsReducer] = useOptimistic<
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
            optimisticItemsReducer({ item: withId, type: "add" });
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
            optimisticItemsReducer({ item: itemToEdit, type: "update" });
            try {
                const returnedItem = await itemDAO.editItem(itemToEdit);
                const newItems = itemReducer(itemData, {
                    item: returnedItem,
                    type: "update",
                });
                setItemData(newItems);
            } catch (error) {
                console.log("Error editing item");
            }
        });
    };

    const archiveDoneItems = async () => {
        startTransition(async () => {
            optimisticItemsReducer({ type: "archive" });
            try {
                await itemDAO.archiveDoneItems();
                const newItems = itemReducer(itemData, { type: "archive" });
                setItemData(newItems);
            } catch (error) {
                console.log("error archiving");
            }
        });
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
                disabled={!itemData.some((item) => item.done) || isPending}
                onClick={archiveDoneItems}
            >
                Archive done items
            </button>
        </div>
    );
};

export default TodoPage;
