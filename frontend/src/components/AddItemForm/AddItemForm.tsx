import { useState, type FormEvent } from "react";
import type { TodoItemData, TodoItemDataNoId } from "../../types";

interface AddItemFormProps {
    titleInitialValue: string;
    submitOnClick: (item: TodoItemDataNoId) => void;
}

const AddItemForm = ({
    titleInitialValue,
    submitOnClick,
}: AddItemFormProps) => {
    const [titleText, setTitleText] = useState(titleInitialValue);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const item: TodoItemDataNoId = {
            title: titleText,
        };
        submitOnClick(item);
        setTitleText("");
    };
    return (
        <form>
            <label>
                <h3>Add an item</h3>
                <input
                    placeholder="Title for an item"
                    value={titleText}
                    onChange={(event) => setTitleText(event.target.value)}
                />
            </label>
            <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
                disabled={titleText ? false : true}
            >
                Add item
            </button>
        </form>
    );
};

export default AddItemForm;
