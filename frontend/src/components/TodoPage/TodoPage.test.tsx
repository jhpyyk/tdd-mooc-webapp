import { act, render, screen } from "@testing-library/react";
import TodoPage from "./TodoPage";
import type { TodoItemData } from "../../types";

describe("TodoPage ", () => {
    describe("after pressing the Archive button", () => {
        test("should not have any items that have their checkbox checked", () => {
            const itemTitle = "item title";
            const items: TodoItemData[] = [
                {
                    id: 1,
                    title: itemTitle,
                    done: false,
                },
                {
                    id: 2,
                    title: itemTitle,
                    done: true,
                },
            ];
            render(<TodoPage initialItems={items} />);

            const archiveButton = screen.getByRole("button", {
                name: /archive/i,
            });
            act(() => {
                archiveButton.click();
            });

            const itemsAfter = screen.getAllByText(itemTitle);
            expect(itemsAfter).toHaveLength(1);
        });
    });
});
