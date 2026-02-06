import { act, render, screen, waitFor, within } from "@testing-library/react";
import TodoPage from "./TodoPage";
import type { TodoItemData } from "../../types";
import { LocalItemDAO } from "../../ItemDAO";

describe("TodoPage ", () => {
    const itemTitle = "item title";
    describe("item checkbox", () => {
        test("can be checked", async () => {
            const testItems: TodoItemData[] = [
                {
                    id: 1,
                    title: itemTitle,
                    done: false,
                    archived: false,
                },
            ];

            render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);
            const item = await waitFor(() =>
                screen.getByRole("listitem", {
                    name: testItems[0].title,
                })
            );
            const checkbox = within(item).getByRole("checkbox");
            act(() => checkbox.click());
            expect(checkbox).toBeChecked();
        });

        test("can be unchecked", async () => {
            const testItems: TodoItemData[] = [
                {
                    id: 1,
                    title: itemTitle,
                    done: true,
                    archived: false,
                },
            ];

            render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);
            const item = await waitFor(() =>
                screen.getByRole("listitem", {
                    name: testItems[0].title,
                })
            );
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
        test("should not have any items that have their checkbox checked", async () => {
            render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);
            await waitFor(
                () => expect(screen.getAllByText(itemTitle)).toHaveLength(2),
                {
                    timeout: 100,
                }
            );

            const archiveButton = screen.getByRole("button", {
                name: /archive/i,
            });
            act(() => {
                archiveButton.click();
            });

            await waitFor(
                () => expect(screen.getAllByText(itemTitle)).toHaveLength(1),
                {
                    timeout: 100,
                }
            );
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

        render(<TodoPage itemDAO={new LocalItemDAO(testItems)} />);

        const items = await waitFor(() => screen.getAllByText(itemTitle));
        expect(items).toHaveLength(1);
    });
});
