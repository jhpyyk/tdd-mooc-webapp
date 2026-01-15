import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddItemForm from "./AddItemForm";

describe("AddItemForm ", () => {
    const user = userEvent.setup();
    test("title field should update it's value when user types into the field", async () => {
        const title = "test title";
        render(<AddItemForm />);
        const titleInput = screen.getByLabelText(/add/i);

        await act(async () => {
            await user.type(titleInput, title);
        });
        expect(titleInput).toHaveValue(title);
    });

    describe("submit button ", async () => {
        test("should add the item with the title in the input field", async () => {
            const title = "added item title";
            render(<AddItemForm />);
            const titleInput = screen.getByLabelText(/add/i);

            await act(async () => {
                await user.type(titleInput, title);
            });

            const submitButton = screen.getByRole("button", {
                name: /add item/i,
            });
            act(() => {
                submitButton.click();
            });

            const addedItem = screen.getByLabelText(title);

            expect(addedItem).toBeVisible();
        });
    });
});
