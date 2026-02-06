import { useState, useTransition } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "../Item.css";
import type { TodoItemData } from "../../../types";

interface TodoItemProps {
    data: TodoItemData;
    buttonOnClick: (newItem: TodoItemData) => Promise<void>;
    initiallyEditing?: boolean;
}
const TodoItem = ({
    data,
    buttonOnClick,
    initiallyEditing = false,
}: TodoItemProps) => {
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(initiallyEditing);

    const handleSaveClick = () => {
        startTransition(async () => {
            await buttonOnClick({
                ...data,
                title: title,
            });
            setIsEditing(false);
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCheckboxEvent = (newDone: boolean) => {
        buttonOnClick({
            ...data,
            done: newDone,
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
    const buttonHandler = isEditing ? handleSaveClick : handleEditClick;

    return (
        <div
            className="todo-item-container"
            role="listitem"
            aria-label={data.title}
        >
            <Checkbox
                initiallyChecked={data.done}
                onCheckedChange={handleCheckboxEvent}
            />
            <button
                onClick={() => buttonHandler()}
                disabled={!title || isPending}
            >
                {editButtonText}
            </button>
            <div className="item-title">{titleDisplay}</div>
        </div>
    );
};

export default TodoItem;
