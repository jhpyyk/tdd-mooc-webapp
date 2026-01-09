import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddItemForm from "./AddItemForm";

describe("AddItemForm ", () => {
    const title = "test title";
    test("title input can be filled", async () => {
        const user = userEvent.setup();
        render(<AddItemForm />);
        const titleInput = screen.getByLabelText(/add/i);

        await user.type(titleInput, title);
        expect(titleInput).toHaveValue(title);
    });
});
