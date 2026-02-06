import { act, render, screen, waitFor, within } from "@testing-library/react";
import ArchivePage from "./ArchivePage";
import { LocalItemDAO } from "../../ItemDAO";
import type { TodoItemData } from "../../types";

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
        render(<ArchivePage itemDAO={new LocalItemDAO(testItems)} />);

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
        render(<ArchivePage itemDAO={new LocalItemDAO(testItems)} />);
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
