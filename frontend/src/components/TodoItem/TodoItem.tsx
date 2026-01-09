import { useState } from "react";

interface TodoItemProps {
    title: string;
    initiallyChecked?: boolean;
}
const TodoItem = ({ title, initiallyChecked = false }: TodoItemProps) => {
    const [checked, setChecked] = useState(initiallyChecked);
    return (
        <div>
            <input
                type="checkbox"
                aria-label={`checkbox-${title}`}
                checked={checked}
                onChange={() => setChecked(!checked)}
            />
            <p>{title}</p>
        </div>
    );
};

export default TodoItem;
