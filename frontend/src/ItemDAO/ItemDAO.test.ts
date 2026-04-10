import type { TodoItemData, TodoItemDataNoId } from "../types";
import { ItemDAOImpl } from "./ItemDAO";
import {
    createMockServerSuccess,
    createMockServerThrowsError,
} from "./mockServer";

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

    test("test add item", async () => {
        const title = "new item";
        const dao = new ItemDAOImpl(baseUrl);
        const addedItem = await dao.addItem(title);
        expect(addedItem.title).toEqual(title);
        expect(addedItem.done).toEqual(false);
        expect(addedItem.archived).toEqual(false);
    });
});

describe("Test item DAO error", () => {
    const baseUrl = "http://localhost:3000";
    const mockServer = createMockServerThrowsError(baseUrl);

    beforeAll(() => mockServer.listen());
    afterEach(() => mockServer.resetHandlers());
    afterAll(() => mockServer.close());
    test("test get all items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        await expect(dao.getAllItems()).rejects.toThrow();
    });

    test("test get active items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        await expect(dao.getActiveItems()).rejects.toThrow();
    });

    test("test get active items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        await expect(dao.getArchivedItems()).rejects.toThrow();
    });

    test("test add item", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        await expect(dao.addItem("title")).rejects.toThrow();
    });
});
