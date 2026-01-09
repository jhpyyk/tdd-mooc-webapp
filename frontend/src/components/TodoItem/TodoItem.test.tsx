import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";
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
        const item = screen.getByText(title);
        const checkbox = within(item).getByRole("checkbox");
        act(() => checkbox.click());
        expect(checkbox).toBeChecked();
    });
});
