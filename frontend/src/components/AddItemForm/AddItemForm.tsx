import { useState } from "react";

const AddItemForm = () => {
    const [titleText, setTitleText] = useState("");

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
