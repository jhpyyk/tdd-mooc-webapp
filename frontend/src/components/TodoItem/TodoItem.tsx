import { useState } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "./TodoItem.css";
import type { TodoItemData } from "../../types";

interface TodoItemProps {
    data: TodoItemData;
    initiallyChecked?: boolean;
}
const TodoItem = ({ data, initiallyChecked = false }: TodoItemProps) => {
    const [checked, setChecked] = useState(initiallyChecked);
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
            <span>{data.title}</span>
        </div>
    );
};

export default TodoItem;
