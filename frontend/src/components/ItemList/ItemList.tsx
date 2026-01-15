import type { TodoItemData } from "../../types";
import TodoItem from "../TodoItem/TodoItem";

interface ItemListProps {
    itemData: TodoItemData[];
}

const ItemList = ({ itemData }: ItemListProps) => {
    const listItems = itemData.map((item) => {
        return (
            <li>
                <TodoItem data={item} />
            </li>
        );
    });
    return (
        <>
            <ul>{listItems}</ul>
        </>
    );
};

export default ItemList;
