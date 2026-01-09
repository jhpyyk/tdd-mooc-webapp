import { useState } from "react";
import Checkbox from "./Checkbox/Checkbox";
import "./TodoItem.css";

interface TodoItemProps {
    title: string;
    initiallyChecked?: boolean;
}
const TodoItem = ({ title, initiallyChecked = false }: TodoItemProps) => {
    const [checked, setChecked] = useState(initiallyChecked);
    return (
        <div className="todo-item-container">
            <label className="todo-item-label">
                <Checkbox
                    checked={checked}
                    setChecked={() => setChecked(!checked)}
                />
                <span>{title}</span>
            </label>
        </div>
    );
};

export default TodoItem;
