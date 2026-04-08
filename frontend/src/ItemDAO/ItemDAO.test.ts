import type { TodoItemData } from "../types";
import { ItemDAOImpl } from "./ItemDAO";
import { createMockServer as createMockServerSuccess } from "./mockServer";

describe("Test item DAO success", () => {
    const baseUrl = "http://localhost:3000";
    const initialItems: TodoItemData[] = [
        {
            id: 1,
            title: "title1",
            done: false,
            archived: false,
        },
        {
            id: 2,
            title: "title2",
            done: true,
            archived: false,
        },
        {
            id: 3,
            title: "title3",
            done: false,
            archived: true,
        },
        {
            id: 4,
            title: "title4",
            done: true,
            archived: true,
        },
    ];
    const mockServer = createMockServerSuccess(baseUrl, initialItems);

    beforeAll(() => mockServer.listen());
    afterEach(() => mockServer.resetHandlers());
    afterAll(() => mockServer.close());

    test("test get all items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        const items = await dao.getAllItems();
        expect(items).toEqual(initialItems);
    });
    test("test get active items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        const items = await dao.getActiveItems();
        expect(items).toEqual([initialItems[0], initialItems[1]]);
    });

    test("test get archived items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        const items = await dao.getArchivedItems();
        expect(items).toEqual([initialItems[2], initialItems[3]]);
    });
});
