import { render, screen } from "@testing-library/react";
import TodoItem from "../TodoItem/TodoItem";
import ItemList from "./ItemList";

describe("ItemList ", () => {
    test("should display multiple items", () => {
        const titleItem1 = "item 1";
        const titleItem2 = "item 2";
        const item1 = <TodoItem title={titleItem1} />;
        const item2 = <TodoItem title={titleItem2} />;

        const items = [item1, item2];

        render(<ItemList items={items} />);

        const renderedItem1 = screen.getByLabelText(titleItem1);
        const renderedItem2 = screen.getByLabelText(titleItem2);

        expect(renderedItem1).toBeVisible();
        expect(renderedItem2).toBeVisible();
    });
});
