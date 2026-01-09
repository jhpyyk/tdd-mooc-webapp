import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoItem from "./TodoItem";

describe("TodoItem ", () => {
    test("item has a title", () => {
        const title = "test title";
        render(<TodoItem title={title} />);

        const item = screen.getByText(title);

        expect(item).toBeDefined();
    });

    test("checkbox can be checked", () => {
        const title = "test title";
        render(<TodoItem title={title} />);

        const checkbox = screen.getByRole("checkbox", {
            name: `checkbox-${title}`,
        });

        checkbox.click();

        expect(checkbox).toBeChecked();
    });
});
