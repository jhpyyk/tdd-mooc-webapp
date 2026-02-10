import { act, render, screen, waitFor, within } from "@testing-library/react";
import ArchivePage from "./ArchivePage";
import type { TodoItemData } from "../../types";
import { createDeferred, MockDAO } from "../../testHelpers";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

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

    test("should delete items optimistically", async () => {
        const user = userEvent.setup();
        const itemTitle = "test item";
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: true,
                archived: true,
            },
        ];
        const mockItemDAO = new MockDAO(testItems);

        const deferred = createDeferred();
        mockItemDAO.deleteItem = vi.fn(() => deferred.promise);
        render(<ArchivePage itemDAO={new MockDAO(testItems)} />);

        const item = await screen.findByRole("listitem", {
            name: itemTitle,
        });
        const deleteButton = within(item).getByRole("button");
        await user.click(deleteButton);
        expect(screen.queryAllByText(itemTitle)).toHaveLength(0);
        act(() => deferred.resolve());
    });
    test("should not delete items on error", async () => {
        const user = userEvent.setup();
        const itemTitle = "test item";
        const testItems: TodoItemData[] = [
            {
                id: 1,
                title: itemTitle,
                done: true,
                archived: true,
            },
        ];
        const mockItemDAO = new MockDAO(testItems);

        mockItemDAO.deleteItem = vi.fn().mockRejectedValue(new Error("error"));
        render(<ArchivePage itemDAO={mockItemDAO} />);

        const item = await screen.findByRole("listitem", {
            name: itemTitle,
        });
        const deleteButton = within(item).getByRole("button");
        await user.click(deleteButton);
        expect(await screen.findByText(itemTitle)).toBeVisible();
    });
});
