import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";
import { act } from "react";

describe("TodoItem ", () => {
    const title = "test title";
    test("item has a title", () => {
        render(<TodoItem title={title} />);

        const item = screen.getByText(title);

        expect(item).toBeDefined();
    });

    test("checkbox can be checked", () => {
        render(<TodoItem title={title} />);
        const checkbox = screen.getByLabelText(title);
        act(() => checkbox.click());
        expect(checkbox).toBeChecked();
    });

    test("checkbox can be unchecked", () => {
        render(<TodoItem title={title} initiallyChecked />);
        const checkbox = screen.getByLabelText(title);
        act(() => checkbox.click());
        expect(checkbox).not.toBeChecked();
    });
});
