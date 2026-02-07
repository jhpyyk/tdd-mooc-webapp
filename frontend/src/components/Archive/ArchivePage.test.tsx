import { act, render, screen, waitFor, within } from "@testing-library/react";
import ArchivePage from "./ArchivePage";
import { type ItemDAO } from "../../ItemDAO";
import type { TodoItemData } from "../../types";
import { vi } from "vitest";

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
describe("ArchivePage ", () => {
    test("should display only archived items", async () => {
        const itemTitle = "test item";
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
        render(<ArchivePage itemDAO={new MockDAO(testItems)} />);

        const items = await waitFor(() => screen.getAllByText(itemTitle));
        expect(items).toHaveLength(1);
    });

    test("should not display an item after it's deleted", async () => {
        const itemTitle = "test item";
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: true,
                archived: true,
            },
        ];
        render(<ArchivePage itemDAO={new MockDAO(testItems)} />);
        const item = await waitFor(() =>
            screen.getByRole("listitem", {
                name: testItems[0].title,
            })
        );
        const deleteButton = within(item).getByRole("button");

        act(() => {
            deleteButton.click();
        });

        expect(screen.queryAllByText(itemTitle)).toHaveLength(0);
    });
});
