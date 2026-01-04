import { render, screen } from "@testing-library/react";
import TodoItem from "./TodoItem";

test("todo item has a title", () => {
    const title = "test title";
    render(<TodoItem title={title} />);

    const item = screen.getByText(title);

    expect(item).toBeDefined();
});
