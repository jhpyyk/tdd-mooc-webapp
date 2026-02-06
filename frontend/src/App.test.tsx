import { act, render, screen, waitFor } from "@testing-library/react";
import type { TodoItemData } from "./types";
import App from "./App";
import { LocalItemDAO } from "./ItemDAO";
import { memoryLocation } from "wouter/memory-location";

describe("App ", () => {
    describe("when pressing archive link on todo page", () => {
        test("should go to archive page", async () => {
            const itemTitle = "test title";
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
                    archived: true,
                },
            ];

            const { hook } = memoryLocation({
                path: "/todo",
            });

            render(
                <App itemDAO={new LocalItemDAO(testItems)} routerHook={hook} />
            );

            const archiveLink = screen.getByRole("link", { name: /archive/i });

            act(() => {
                archiveLink.click();
            });

            const archivedItem = await waitFor(() =>
                screen.getByText(itemTitle)
            );

            expect(archivedItem).toBeVisible();
        });
    });
    describe("when pressing todo link on archive page", () => {
        test("should go to todo page", async () => {
            const itemTitle = "test title";
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
                    archived: true,
                },
            ];

            const { hook } = memoryLocation({
                path: "/archive",
            });

            render(
                <App itemDAO={new LocalItemDAO(testItems)} routerHook={hook} />
            );

            const todoLink = screen.getByRole("link", { name: /todo/i });

            act(() => {
                todoLink.click();
            });

            const activeItem = await waitFor(() => screen.getByText(itemTitle));

            expect(activeItem).toBeVisible();
        });
    });
});
