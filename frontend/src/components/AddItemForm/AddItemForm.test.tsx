import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddItemForm from "./AddItemForm";
import { vi } from "vitest";

describe("AddItemForm ", () => {
    const user = userEvent.setup();
    describe("title field ", () => {
        test("should update it's value when user types into the field", async () => {
            const title = "test title";
            render(
                <AddItemForm titleInitialValue="" submitOnClick={() => {}} />
            );
            const titleInput = screen.getByLabelText(/add/i);

            await act(async () => {
                await user.type(titleInput, title);
            });
            expect(titleInput).toHaveValue(title);
        });
        test("should be empty after submitting", async () => {
            render(
                <AddItemForm
                    titleInitialValue="test title"
                    submitOnClick={() => {}}
                />
            );
            const titleInput = screen.getByLabelText(/add/i);
            const submitButton = screen.getByRole("button", {
                name: /add item/i,
            });
            act(() => {
                submitButton.click();
            });

            expect(titleInput).toHaveValue("");
        });
    });

    describe("submit button ", async () => {
        test("should add the item with the title in the input field", async () => {
            const title = "added item title";
            const mockOnClick = vi.fn();
            render(
                <AddItemForm
                    titleInitialValue={title}
                    submitOnClick={mockOnClick}
                />
            );

            const submitButton = screen.getByRole("button", {
                name: /add item/i,
            });
            act(() => {
                submitButton.click();
            });

            expect(mockOnClick).toHaveBeenCalledWith({
                title: title,
            });
        });

        test("should be disabled when the input is empty", () => {
            const mockOnClick = vi.fn();
            render(
                <AddItemForm
                    titleInitialValue={""}
                    submitOnClick={mockOnClick}
                />
            );

            const submitButton = screen.getByRole("button", {
                name: /add item/i,
            });

            expect(submitButton).toBeDisabled();
        });
    });
});
