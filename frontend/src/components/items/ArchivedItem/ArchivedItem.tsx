import Checkbox from "../TodoItem/Checkbox/Checkbox";
import "../Item.css";
import type { TodoItemData } from "../../../types";

interface ArchivedItemProps {
    data: TodoItemData;
    buttonOnClick: (item: TodoItemData) => void;
}
const ArchivedItem = ({ data, buttonOnClick }: ArchivedItemProps) => {
    return (
        <div
            className="todo-item-container"
            role="listitem"
            aria-label={data.title}
        >
            <Checkbox
                initiallyChecked={data.done}
                onCheckedChange={() => {}}
                disabled
            />
            <button onClick={() => buttonOnClick(data)}>Delete</button>
            <div className="item-title">{<span>{data.title}</span>}</div>
        </div>
    );
};

export default ArchivedItem;
