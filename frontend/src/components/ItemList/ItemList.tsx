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
            <li className="list-item" key={item.id}>
                <TodoItem data={item} editItem={editItem} />
            </li>
        );
    });
    return (
        <div className="item-list-container">
            <ul className="list">{listItems}</ul>
        </div>
    );
};

export default ItemList;
