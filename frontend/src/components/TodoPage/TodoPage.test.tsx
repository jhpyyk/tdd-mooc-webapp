import { act, render, screen, within } from "@testing-library/react";
import TodoPage from "./TodoPage";
import type { TodoItemData } from "../../types";
import type { ItemDAO } from "../../ItemDAO";
import { vi } from "vitest";

const createItemDaoMock = () => {
    const itemDaoMock: ItemDAO = {
        getItems: vi.fn(),
    };
    return itemDaoMock;
};

describe("TodoPage ", () => {
    const itemTitle = "item title";
    describe("item checkbox", () => {
        test("can be checked", () => {
            const testItems: TodoItemData[] = [
                {
                    id: 1,
                    title: itemTitle,
                    done: false,
                },
            ];

            const itemDaoMock = createItemDaoMock();
            itemDaoMock.getItems = vi.fn().mockReturnValue(testItems);

            render(<TodoPage itemDAO={itemDaoMock} />);
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
                },
            ];

            const itemDaoMock = createItemDaoMock();
            itemDaoMock.getItems = vi.fn().mockReturnValue(testItems);

            render(<TodoPage itemDAO={itemDaoMock} />);
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
            },
        ];

        const itemDaoMock = createItemDaoMock();
        itemDaoMock.getItems = vi.fn().mockReturnValue(testItems);

        render(<TodoPage itemDAO={itemDaoMock} />);

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
            },
            {
                id: 2,
                title: itemTitle,
                done: true,
            },
        ];
        test("should not have any items that have their checkbox checked", () => {
            const itemDaoMock = createItemDaoMock();
            itemDaoMock.getItems = vi.fn().mockReturnValue(testItems);
            render(<TodoPage itemDAO={itemDaoMock} />);

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
