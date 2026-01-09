import { useState } from "react";

const AddItemForm = () => {
    const [titleText, setTitleText] = useState("");

    return (
        <form>
            <input
                placeholder="Title for an item"
                value={titleText}
                onChange={(event) => setTitleText(event.target.value)}
            />
        </form>
    );
};

export default AddItemForm;
