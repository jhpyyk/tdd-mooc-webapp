import { useState } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "./TodoItem.css";
import type { TodoItemData } from "../../types";

interface TodoItemProps {
    data: TodoItemData;
    editItem: (newItem: TodoItemData) => void;
    initiallyEditing?: boolean;
}
const TodoItem = ({
    data,
    editItem,
    initiallyEditing = false,
}: TodoItemProps) => {
    const [checked, setChecked] = useState(data.done);
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(initiallyEditing);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
        editItem({
            ...data,
            title: title,
        });
    };

    const titleEdit = (
        <input
            aria-label="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
    );

    const titleText = <span>{title}</span>;
    const titleDisplay = isEditing ? titleEdit : titleText;

    const editButtonText = isEditing ? "Save" : "Edit";

    return (
        <div
            className="todo-item-container"
            role="listitem"
            aria-label={data.title}
        >
            <Checkbox
                checked={checked}
                setChecked={() => setChecked(!checked)}
            />
            <button onClick={() => toggleEditing()} disabled={!title}>
                {editButtonText}
            </button>
            <div className="item-title">{titleDisplay}</div>
        </div>
    );
};

export default TodoItem;
