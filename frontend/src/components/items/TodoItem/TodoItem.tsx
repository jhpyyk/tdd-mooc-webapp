import { useOptimistic, useState, useTransition } from "react";
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
    const [optimisticTitle, setOptimisticTitle] = useOptimistic(data.title);
    const [titleInputValue, setTitleInputValue] = useState(data.title);
    const [isEditing, setIsEditing] = useState(initiallyEditing);

    const handleSaveClick = () => {
        setIsEditing(false);
        startTransition(async () => {
            setOptimisticTitle(titleInputValue);
            try {
                await buttonOnClick({
                    ...data,
                    title: titleInputValue,
                });
            } catch (error) {
                console.log(error);
            }
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
            value={titleInputValue}
            onChange={(e) => setTitleInputValue(e.target.value)}
        />
    );

    const titleText = <span>{optimisticTitle}</span>;
    const titleDisplay = isEditing ? titleEdit : titleText;

    const editButtonText = isEditing || isPending ? "Save" : "Edit";
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
                disabled={!optimisticTitle || isPending}
            >
                {editButtonText}
            </button>
            <div className="item-title">{titleDisplay}</div>
        </div>
    );
};

export default TodoItem;
