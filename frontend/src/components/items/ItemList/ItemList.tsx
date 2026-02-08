import type { TodoItemData } from "../../../types";
import ArchivedItem from "../ArchivedItem/ArchivedItem";
import TodoItem from "../TodoItem/TodoItem";
import "./ItemList.css";

interface ItemListProps {
    itemData: TodoItemData[];
    buttonOnClick: (newItem: TodoItemData) => Promise<void>;
    archived?: boolean;
}

const ItemList = ({ itemData, buttonOnClick, archived }: ItemListProps) => {
    const listItems = itemData.map((item) => {
        return (
            <li className="list-item" key={item.id}>
                {archived ? (
                    <ArchivedItem data={item} buttonOnClick={buttonOnClick} />
                ) : (
                    <TodoItem data={item} editItemAction={buttonOnClick} />
                )}
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
