import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";
import { act } from "react";
import type { TodoItemData } from "../../types";
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
        render(<TodoItem data={itemData} editItem={() => {}} />);

        const item = screen.getByText(itemData.title);

        expect(item).toBeDefined();
    });

    test("should render title from props", () => {
        const { rerender } = render(
            <TodoItem data={itemData} editItem={() => {}} />
        );

        const newTitle = "new title";

        rerender(
            <TodoItem
                data={{ ...itemData, title: newTitle }}
                editItem={() => {}}
            />
        );

        const item = screen.getByText(newTitle);
        expect(item).toBeDefined();
    });

    test("should render title from props", () => {
        const { rerender } = render(
            <TodoItem data={itemData} editItem={() => {}} />
        );

        rerender(
            <TodoItem data={{ ...itemData, done: true }} editItem={() => {}} />
        );

        const item = screen.getByRole("listitem", { name: itemData.title });
        const checkbox = within(item).getByRole("checkbox");
        expect(checkbox).toBeChecked();
    });

    describe("edit button ", () => {
        describe("when clicked ", () => {
            describe("while not editing ", () => {
                test("should not clear the item title", () => {
                    render(<TodoItem data={itemData} editItem={() => {}} />);
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

                test("should change the button title ", () => {
                    render(<TodoItem data={itemData} editItem={() => {}} />);
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
                    expect(editButtonTitleAfter).not.toEqual(
                        editButtonTitleBefore
                    );
                });
            });

            describe("while editing ", () => {
                test("should be disabled when title input is empty", () => {
                    render(
                        <TodoItem
                            data={{ ...itemData, title: "" }}
                            editItem={() => {}}
                            initiallyEditing
                        />
                    );
                    const item = screen.getByRole("listitem", {
                        name: "",
                    });
                    const editButton = within(item).getByRole("button");

                    expect(editButton).toBeDisabled();
                });
                test("should call editItem with new title", async () => {
                    const editItemMock = vi.fn();
                    const newTitle = "new title";
                    render(
                        <TodoItem
                            data={{ ...itemData, title: "" }}
                            editItem={editItemMock}
                            initiallyEditing
                        />
                    );
                    const item = screen.getByRole("listitem", {
                        name: "",
                    });
                    const titleEditInput = within(item).getByRole("textbox");
                    const editButton = within(item).getByRole("button");

                    await act(async () => {
                        await user.type(titleEditInput, newTitle);
                        editButton.click();
                    });
                    const newItem = {
                        ...itemData,
                        title: newTitle,
                    };
                    expect(editItemMock).toHaveBeenCalledWith(newItem);
                });

                test("should change the button title ", () => {
                    render(<TodoItem data={itemData} editItem={() => {}} />);
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
                    expect(editButtonTitleAfter).not.toEqual(
                        editButtonTitleBefore
                    );
                });
            });
        });
    });
});
