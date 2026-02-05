import { render, screen } from "@testing-library/react";
import ArchivePage from "./ArchivePage";
import { LocalItemDAO } from "../../ItemDAO";
import type { TodoItemData } from "../../types";

describe("ArchivePage ", () => {
    test("should display only archived items", () => {
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

        const items = screen.getAllByText(itemTitle);
        expect(items).toHaveLength(1);
    });
});
