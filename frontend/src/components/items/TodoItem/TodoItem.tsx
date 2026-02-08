import { startTransition, useOptimistic, useState } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "../Item.css";
import type { TodoItemData } from "../../../types";

interface TodoItemProps {
    data: TodoItemData;
    editItemAction: (newItem: TodoItemData) => Promise<void>;
    initiallyEditing?: boolean;
}
const TodoItem = ({
    data,
    editItemAction,
    initiallyEditing = false,
}: TodoItemProps) => {
    const [optimisticTitle, setOptimisticTitle] = useOptimistic(data.title);
    const [titleInputValue, setTitleInputValue] = useState(data.title);
    const [isEditing, setIsEditing] = useState(initiallyEditing);

    const handleSaveClick = () => {
        setIsEditing(false);
        startTransition(() => {
            setOptimisticTitle(titleInputValue);
            editItemAction({
                ...data,
                title: titleInputValue,
            });
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCheckboxEvent = (newDone: boolean) => {
        editItemAction({
            ...data,
            done: newDone,
        });
    };

    const titleEdit = (
        <input
            aria-label="Todo title"
            value={titleInputValue}
            onChange={(e) => setTitleInputValue(e.target.value)}
        />
    );

    const isSyncing = optimisticTitle !== data.title;
    const titleText = <span>{optimisticTitle}</span>;
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
                disabled={!optimisticTitle || isSyncing}
            >
                {editButtonText}
            </button>
            <div className="item-title">{titleDisplay}</div>
        </div>
    );
};

export default TodoItem;
