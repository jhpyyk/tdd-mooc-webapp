import type { TodoItemData } from "../../types";
import TodoItem from "../TodoItem/TodoItem";
import "./ItemList.css";

interface ItemListProps {
    itemData: TodoItemData[];
    buttonOnClick: (newItem: TodoItemData) => void;
}

const ItemList = ({ itemData, buttonOnClick }: ItemListProps) => {
    const listItems = itemData.map((item) => {
        return (
            <li className="list-item" key={item.id}>
                <TodoItem data={item} buttonOnClick={buttonOnClick} />
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
