import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";
import { act } from "react";
import type { TodoItemData } from "../../types";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("TodoItem ", () => {
    const user = userEvent.setup();
    const itemData: TodoItemData = { id: 1, title: "test title" };
    test("item has a title", () => {
        render(<TodoItem data={itemData} editItem={() => {}} />);

        const item = screen.getByText(itemData.title);

        expect(item).toBeDefined();
    });

    test("checkbox can be checked", () => {
        render(<TodoItem data={itemData} editItem={() => {}} />);
        const item = screen.getByRole("listitem", { name: itemData.title });
        const checkbox = within(item).getByRole("checkbox");
        act(() => checkbox.click());
        expect(checkbox).toBeChecked();
    });

    test("checkbox can be unchecked", () => {
        render(
            <TodoItem data={itemData} editItem={() => {}} initiallyChecked />
        );
        const item = screen.getByRole("listitem", { name: itemData.title });
        const checkbox = within(item).getByRole("checkbox");
        act(() => checkbox.click());
        expect(checkbox).not.toBeChecked();
    });

    describe("edit button ", () => {
        describe("when clicked ", () => {
            describe("while not editing ", () => {
                test("should clear the item title", () => {
                    render(
                        <TodoItem
                            data={itemData}
                            editItem={() => {}}
                            initiallyChecked
                        />
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
                    expect(titleAfter).toHaveValue("");
                });

                test("should change the button title ", () => {
                    render(
                        <TodoItem
                            data={itemData}
                            editItem={() => {}}
                            initiallyChecked
                        />
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
                    expect(editButtonTitleAfter).not.toEqual(
                        editButtonTitleBefore
                    );
                });
            });

            describe("while editing ", () => {
                test("should call editItem with new title", async () => {
                    const editItemMock = vi.fn();
                    const newTitle = "new title";
                    render(
                        <TodoItem
                            data={{ ...itemData, title: "" }}
                            editItem={editItemMock}
                            initiallyChecked
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
            });
        });
    });
});
