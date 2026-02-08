import { useState, type FormEvent } from "react";
import type { TodoItemDataNoId } from "../../types";

interface AddItemFormProps {
    titleInitialValue: string;
    submitOnClick: (item: TodoItemDataNoId) => void;
    isPending?: boolean;
}

const AddItemForm = ({
    titleInitialValue,
    submitOnClick,
    isPending,
}: AddItemFormProps) => {
    const [titleText, setTitleText] = useState(titleInitialValue);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const item: TodoItemDataNoId = {
            title: titleText,
            done: false,
            archived: false,
        };
        submitOnClick(item);
        setTitleText("");
    };
    const hasNoTitle = titleText ? false : true;
    const buttonDisabled = hasNoTitle || isPending;
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
                disabled={buttonDisabled}
            >
                Add item
            </button>
        </form>
    );
};

export default AddItemForm;
