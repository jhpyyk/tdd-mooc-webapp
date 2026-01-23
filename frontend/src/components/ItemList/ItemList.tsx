import type { TodoItemData } from "../../types";
import TodoItem from "../TodoItem/TodoItem";
import "./ItemList.css";

interface ItemListProps {
    itemData: TodoItemData[];
    editItem: (newItem: TodoItemData) => void;
}

const ItemList = ({ itemData, editItem }: ItemListProps) => {
    const listItems = itemData.map((item) => {
        return (
            <li className="list-item">
                <TodoItem data={item} editItem={editItem} />
            </li>
        );
    });
    return (
        <>
            <ul className="list">{listItems}</ul>
        </>
    );
};

export default ItemList;
