import { act, render, screen, waitFor } from "@testing-library/react";
import TodoPage from "./TodoPage";
import type { TodoItemData } from "../../types";
import { type ItemDAO } from "../../ItemDAO";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

export class MockDAO implements ItemDAO {
    itemData: TodoItemData[];
    delay: number;

    constructor(initialItems: TodoItemData[], delay = 0) {
        this.itemData = initialItems;
        this.delay = delay;
    }
    addItem = vi.fn();
    editItem = vi.fn();
    archiveDoneItems = vi.fn();
    deleteItem = vi.fn();

    getActiveItems = async () => {
        await new Promise((r) => setTimeout(r, this.delay));
        const items = this.itemData.filter((item) => {
            return !item.archived;
        });
        return items;
    };
    getArchivedItems = async () => {
        await new Promise((r) => setTimeout(r, this.delay));
        const items = this.itemData.filter((item) => {
            return item.archived;
        });
        return items;
    };
}

describe("TodoPage ", () => {
    const itemTitle = "item title";
    test("when there are no checked items Archive button should be disabled", () => {
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: false,
                archived: false,
            },
        ];

        render(<TodoPage itemDAO={new MockDAO(testItems)} />);

        const archiveButton = screen.getByRole("button", {
            name: /archive/i,
        });
        expect(archiveButton).toBeDisabled();
    });
    test("should add an item optimistically", async () => {
        const user = userEvent.setup();
        const mockItemDAO = new MockDAO([]);
        mockItemDAO.addItem = vi.fn(
            () => new Promise((resolve) => setTimeout(resolve, 50))
        );
        render(<TodoPage itemDAO={mockItemDAO} />);

        const titleInput = screen.getByLabelText(/add/i);
        const submitButton = screen.getByRole("button", {
            name: /add item/i,
        });
        await user.type(titleInput, itemTitle);
        await user.click(submitButton);

        expect(await screen.findByText(itemTitle)).toBeVisible();
    });
    test("should not add an item on error", async () => {
        const user = userEvent.setup();
        const mockItemDAO = new MockDAO([]);

        mockItemDAO.addItem = vi.fn().mockRejectedValue(new Error("error"));

        render(<TodoPage itemDAO={mockItemDAO} />);

        const titleInput = await screen.findByLabelText(/add/i);
        const submitButton = screen.getByRole("button", { name: /add item/i });

        await user.type(titleInput, itemTitle);
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(itemTitle)).not.toBeInTheDocument();
        });
    });

    test("should not display archived items", async () => {
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
                done: false,
                archived: true,
            },
        ];

        render(<TodoPage itemDAO={new MockDAO(testItems)} />);
        expect(await screen.findByText(itemTitle)).toBeVisible();
        expect(screen.queryAllByText(itemTitle)).toHaveLength(1);
    });
    test("Archive button should call archiveDoneItems", async () => {
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: true,
                archived: false,
            },
        ];
        const itemDaoMock = new MockDAO(testItems);
        render(<TodoPage itemDAO={itemDaoMock} />);
        const archiveButton = screen.getByRole("button", {
            name: /archive/i,
        });
        await waitFor(() => expect(archiveButton).toBeEnabled(), {
            timeout: 20,
        });
        act(() => {
            archiveButton.click();
        });

        await waitFor(
            () => expect(itemDaoMock.archiveDoneItems).toHaveBeenCalledTimes(1),
            {
                timeout: 20,
            }
        );
    });
});
