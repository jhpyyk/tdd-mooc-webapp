import { act, render, screen, within } from "@testing-library/react";
import TodoPage from "./TodoPage";
import type { TodoItemData } from "../../types";
import { LocalItemDAO } from "../../ItemDAO";

describe("TodoPage ", () => {
    const itemTitle = "item title";
    describe("item checkbox", () => {
        test("can be checked", () => {
            const testItems: TodoItemData[] = [
                {
                    id: 1,
                    title: itemTitle,
                    done: false,
                    archived: false,
                },
            ];

            render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);
            const item = screen.getByRole("listitem", {
                name: testItems[0].title,
            });
            const checkbox = within(item).getByRole("checkbox");
            act(() => checkbox.click());
            expect(checkbox).toBeChecked();
        });

        test("can be unchecked", () => {
            const testItems: TodoItemData[] = [
                {
                    id: 1,
                    title: itemTitle,
                    done: true,
                    archived: false,
                },
            ];

            render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);
            const item = screen.getByRole("listitem", {
                name: testItems[0].title,
            });
            const checkbox = within(item).getByRole("checkbox");
            act(() => checkbox.click());
            expect(checkbox).not.toBeChecked();
        });
    });

    test("when there are no checked items Archive button should be disabled", () => {
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: false,
                archived: false,
            },
        ];

        render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);

        const archiveButton = screen.getByRole("button", {
            name: /archive/i,
        });
        expect(archiveButton).toBeDisabled();
    });

    describe("after pressing the Archive button", () => {
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: false,
                archived: false,
            },
            {
                id: 2,
                title: itemTitle,
                done: true,
                archived: false,
            },
        ];
        test("should not have any items that have their checkbox checked", () => {
            render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);

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
