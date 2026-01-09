import { useState } from "react";
import Checkbox from "./Checkbox/Checkbox";

interface TodoItemProps {
    title: string;
    initiallyChecked?: boolean;
}
const TodoItem = ({ title, initiallyChecked = false }: TodoItemProps) => {
    const [checked, setChecked] = useState(initiallyChecked);
    return (
        <label>
            <Checkbox
                checked={checked}
                setChecked={() => setChecked(!checked)}
            />
            {title}
        </label>
    );
};

export default TodoItem;
