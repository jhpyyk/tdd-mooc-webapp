import { render, screen } from "@testing-library/react";
import ItemList from "./ItemList";
import type { TodoItemData } from "../../types";

describe("ItemList ", () => {
    test("should display multiple items", () => {
        const item1 = { title: "item 1" };
        const item2 = { title: "item 2" };

        const items: TodoItemData[] = [item1, item2];

        render(<ItemList itemData={items} />);

        const renderedItem1 = screen.getByLabelText(item1.title);
        const renderedItem2 = screen.getByLabelText(item2.title);

        expect(renderedItem1).toBeVisible();
        expect(renderedItem2).toBeVisible();
    });
});
