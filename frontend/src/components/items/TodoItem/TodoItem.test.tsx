import { render, screen, within, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";
import type { TodoItemData } from "../../../types";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("TodoItem ", () => {
    const user = userEvent.setup();
    const itemData: TodoItemData = {
        id: 1,
        title: "test title",
        done: false,
        archived: false,
    };
    test("item has a title", () => {
        render(<TodoItem data={itemData} buttonOnClick={async () => {}} />);

        const item = screen.getByText(itemData.title);

        expect(item).toBeDefined();
    });

    describe("edit button ", () => {
        describe("when clicked ", () => {
            test("should not clear the item title", () => {
                render(
                    <TodoItem data={itemData} buttonOnClick={async () => {}} />
                );
                const item = screen.getByRole("listitem", {
                    name: itemData.title,
                });
                const editButton = within(item).getByRole("button");

                const titleBefore = within(item).getByText(itemData.title);
                expect(titleBefore).toBeDefined();
                act(() => {
                    editButton.click();
                });
                const titleAfter = within(item).getByRole("textbox");
                expect(titleAfter).toHaveValue(itemData.title);
            });

            test("should change the button text ", () => {
                render(
                    <TodoItem data={itemData} buttonOnClick={async () => {}} />
                );
                const item = screen.getByRole("listitem", {
                    name: itemData.title,
                });
                const editButton = within(item).getByRole("button");

                const editButtonTitleBefore = editButton.textContent;
                expect(editButtonTitleBefore).toBeDefined();
                act(() => {
                    editButton.click();
                });
                const editButtonTitleAfter = editButton.textContent;
                expect(editButtonTitleAfter).not.toEqual(editButtonTitleBefore);
            });
        });
    });

    describe("save button", () => {
        test("should be disabled when title input is empty", () => {
            render(
                <TodoItem
                    data={{ ...itemData, title: "" }}
                    buttonOnClick={async () => {}}
                    initiallyEditing
                />
            );
            const item = screen.getByRole("listitem", {
                name: "",
            });
            const editButton = within(item).getByRole("button");

            expect(editButton).toBeDisabled();
        });

        test("should be disabled when waiting for a response", () => {
            const onClick = async () => {
                await new Promise((r) => setTimeout(r, 5));
            };
            render(
                <TodoItem
                    data={{ ...itemData }}
                    buttonOnClick={onClick}
                    initiallyEditing
                />
            );
            const item = screen.getByRole("listitem", {
                name: itemData.title,
            });
            const editButton = within(item).getByRole("button");

            act(() => {
                editButton.click();
            });

            expect(editButton).toBeDisabled();
        });
        test("should call editItem with new title", async () => {
            const editItemMock = vi.fn();
            const oldTitle = "title";
            const userTypes = "new";
            const newTitle = oldTitle + userTypes;
            render(
                <TodoItem
                    data={{ ...itemData, title: oldTitle }}
                    buttonOnClick={editItemMock}
                    initiallyEditing
                />
            );
            const item = screen.getByRole("listitem", {
                name: oldTitle,
            });
            const titleEditInput = within(item).getByRole("textbox");
            const editButton = within(item).getByRole("button");

            await user.type(titleEditInput, userTypes);
            await act(async () => {
                editButton.click();
            });
            const newItem = {
                ...itemData,
                title: newTitle,
            };
            expect(editItemMock).toHaveBeenCalledWith(newItem);
        });

        test("should change the item title optimistically", async () => {
            const editItemMock = vi.fn();
            const oldTitle = "title";
            const userTypes = "new";
            const newTitle = oldTitle + userTypes;
            render(
                <TodoItem
                    data={{ ...itemData, title: oldTitle }}
                    buttonOnClick={editItemMock}
                    initiallyEditing
                />
            );
            const item = screen.getByRole("listitem", {
                name: oldTitle,
            });
            const titleEditInput = within(item).getByRole("textbox");
            const editButton = within(item).getByRole("button");

            await user.type(titleEditInput, userTypes);
            act(() => {
                editButton.click();
            });
            expect(screen.getByText(newTitle)).toBeVisible();
        });
        test("should not change the item title on buttonOnClick error", async () => {
            const editItemMock = () => {
                throw new Error("error");
            };
            const oldTitle = "title";
            const userTypes = "new";
            render(
                <TodoItem
                    data={{ ...itemData, title: oldTitle }}
                    buttonOnClick={editItemMock}
                    initiallyEditing
                />
            );
            const item = screen.getByRole("listitem", {
                name: oldTitle,
            });
            const titleEditInput = within(item).getByRole("textbox");
            const editButton = within(item).getByRole("button");

            await user.type(titleEditInput, userTypes);
            act(() => {
                editButton.click();
            });
            await waitFor(
                () => expect(screen.getByText(oldTitle)).toBeVisible(),
                { timeout: 10 }
            );
        });
        test("should change the button text ", () => {
            render(<TodoItem data={itemData} buttonOnClick={async () => {}} />);
            const item = screen.getByRole("listitem", {
                name: itemData.title,
            });
            const editButton = within(item).getByRole("button");

            const editButtonTitleBefore = editButton.textContent;
            expect(editButtonTitleBefore).toBeDefined();
            act(() => {
                editButton.click();
            });
            const editButtonTitleAfter = editButton.textContent;
            expect(editButtonTitleAfter).not.toEqual(editButtonTitleBefore);
        });
    });
    test("checkbox can be checked", () => {
        render(<TodoItem data={itemData} buttonOnClick={async () => {}} />);
        const item = screen.getByRole("listitem", {
            name: itemData.title,
        });
        const checkbox = within(item).getByRole("checkbox");

        act(() => {
            checkbox.click();
        });

        expect(checkbox).toBeChecked();
    });
    test("checkbox can be unchecked", () => {
        render(
            <TodoItem
                data={{ ...itemData, done: true }}
                buttonOnClick={async () => {}}
            />
        );
        const item = screen.getByRole("listitem", {
            name: itemData.title,
        });
        const checkbox = within(item).getByRole("checkbox");

        act(() => {
            checkbox.click();
        });

        expect(checkbox).not.toBeChecked();
    });
});
