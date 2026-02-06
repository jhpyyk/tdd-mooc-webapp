import { render, screen } from "@testing-library/react";
import ItemList from "./ItemList";
import type { TodoItemData } from "../../types";

describe("ItemList ", () => {
    test("should display multiple items", () => {
        const item1 = { id: 1, title: "item 1", done: false, archived: false };
        const item2 = { id: 2, title: "item 2", done: false, archived: false };

        const items: TodoItemData[] = [item1, item2];

        render(<ItemList itemData={items} buttonOnClick={() => {}} />);

        const renderedItem1 = screen.getByLabelText(item1.title);
        const renderedItem2 = screen.getByLabelText(item2.title);

        expect(renderedItem1).toBeVisible();
        expect(renderedItem2).toBeVisible();
    });
});
