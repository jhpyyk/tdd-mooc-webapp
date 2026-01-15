import { useState } from "react";

interface AddItemFormProps {
    titleInitialValue: string;
}

const AddItemForm = ({ titleInitialValue }: AddItemFormProps) => {
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
        </form>
    );
};

export default AddItemForm;
