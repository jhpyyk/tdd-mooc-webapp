import { useState, useTransition } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "../Item.css";
import type { TodoItemData } from "../../../types";

interface TodoItemProps {
    data: TodoItemData;
    buttonOnClick: (newItem: TodoItemData) => void;
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
        setIsEditing(false);
        startTransition(() => {
            buttonOnClick({
                ...data,
                title: title,
            });
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
    const buttonAction = isEditing ? handleSaveClick : handleEditClick;

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
                onClick={() => buttonAction()}
                disabled={!title || isPending}
            >
                {editButtonText}
            </button>
            <div className="item-title">{titleDisplay}</div>
        </div>
    );
};

export default TodoItem;
