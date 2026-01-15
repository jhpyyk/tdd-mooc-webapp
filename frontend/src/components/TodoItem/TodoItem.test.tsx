import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";
import { act } from "react";
import type { TodoItemData } from "../../types";

describe("TodoItem ", () => {
    const itemData: TodoItemData = { title: "test title" };
    test("item has a title", () => {
        render(<TodoItem data={itemData} />);

        const item = screen.getByText(itemData.title);

        expect(item).toBeDefined();
    });

    test("checkbox can be checked", () => {
        render(<TodoItem data={itemData} />);
        const checkbox = screen.getByLabelText(itemData.title);
        act(() => checkbox.click());
        expect(checkbox).toBeChecked();
    });

    test("checkbox can be unchecked", () => {
        render(<TodoItem data={itemData} initiallyChecked />);
        const checkbox = screen.getByLabelText(itemData.title);
        act(() => checkbox.click());
        expect(checkbox).not.toBeChecked();
    });
});
