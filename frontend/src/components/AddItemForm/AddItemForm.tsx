import { useState } from "react";

interface AddItemFormProps {
    titleInitialValue: string;
    submitOnClick: () => void;
}

const AddItemForm = ({
    titleInitialValue,
    submitOnClick,
}: AddItemFormProps) => {
    const [titleText, setTitleText] = useState(titleInitialValue);

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
            <button type="submit" onClick={submitOnClick}>
                Add item
            </button>
        </form>
    );
};

export default AddItemForm;
