import type { TodoItemData } from "../../types";
import TodoItem from "../TodoItem/TodoItem";
import "./ItemList.css";

interface ItemListProps {
    itemData: TodoItemData[];
}

const ItemList = ({ itemData }: ItemListProps) => {
    const listItems = itemData.map((item) => {
        return (
            <li className="list-item">
                <TodoItem data={item} />
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
