import { useState } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "./TodoItem.css";
import type { TodoItemData } from "../../types";

interface TodoItemProps {
    data: TodoItemData;
    editItem: (newItem: TodoItemData) => void;
    initiallyChecked?: boolean;
}
const TodoItem = ({
    data,
    editItem,
    initiallyChecked = false,
}: TodoItemProps) => {
    const [checked, setChecked] = useState(initiallyChecked);
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => {
        if (!isEditing) {
            setTitle("");
        }

        setIsEditing(!isEditing);
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
            <button onClick={() => toggleEditing()}>Edit</button>
            {titleDisplay}
        </div>
    );
};

export default TodoItem;
