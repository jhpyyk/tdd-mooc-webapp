import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";
import { act } from "react";
import type { TodoItemData } from "../../types";

describe("TodoItem ", () => {
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
        describe("clicked ", () => {
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
        });
    });
});
