import type { TodoItemData } from "../types";
import { InvalidResponseDataError, ItemDAOImpl } from "./ItemDAO";
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

    const dao = new ItemDAOImpl(baseUrl);

    beforeAll(() => mockServer.listen());
    afterEach(() => mockServer.resetHandlers());
    afterAll(() => mockServer.close());

    test("test get all items", async () => {
        const items = await dao.getAllItems();
        expect(items).toEqual(initialItems);
    });
    test("test get active items", async () => {
        const items = await dao.getActiveItems();
        expect(items).toEqual([initialItems[0], initialItems[1]]);
    });

    test("test get archived items", async () => {
        const items = await dao.getArchivedItems();
        expect(items).toEqual([initialItems[2], initialItems[3]]);
    });

    test("test add item", async () => {
        const title = "new item";
        const addedItem = await dao.addItem(title);
        expect(addedItem.title).toEqual(title);
        expect(addedItem.done).toEqual(false);
        expect(addedItem.archived).toEqual(false);
    });

    test("test edit item returns edited item", async () => {
        const newTitle = "new title";
        const newDone = !initialItems[0].done;
        const newArchived = !initialItems[0].archived;
        const itemToEdit = {
            ...initialItems[0],
            title: newTitle,
            done: newDone,
            archived: newArchived,
        };
        const editedItem: TodoItemData = await dao.editItem(itemToEdit);
        expect(editedItem.title).toEqual(newTitle);
        expect(editedItem.done).toEqual(newDone);
        expect(editedItem.archived).toEqual(newArchived);
    });

    test("test archive done items", async () => {
        await expect(dao.archiveDoneItems()).resolves.toBe(undefined);
    });

    test("test delete item", async () => {
        await expect(dao.deleteItem(1)).resolves.toBe(undefined);
    });
});

describe("Test item DAO error", () => {
    const baseUrl = "http://localhost:3000";
    const mockServer = createMockServerThrowsError(baseUrl);
    const dao = new ItemDAOImpl(baseUrl);

    beforeAll(() => mockServer.listen());
    afterEach(() => mockServer.resetHandlers());
    afterAll(() => mockServer.close());
    test("test get all items internal error", async () => {
        await expect(dao.getAllItems()).rejects.toThrow("500");
    });

    test("test get active items internal error", async () => {
        await expect(dao.getActiveItems()).rejects.toThrow("500");
    });

    test("test get archived items internal error", async () => {
        await expect(dao.getArchivedItems()).rejects.toThrow("500");
    });

    test("test add item internal error", async () => {
        await expect(dao.addItem("title")).rejects.toThrow("500");
    });

    test("test add item invalid response data", async () => {
        await expect(dao.addItem("invaliddata")).rejects.toThrow(
            InvalidResponseDataError
        );
    });
    test("test edit item internal error", async () => {
        const item = {
            id: 1,
            title: "some title",
            done: false,
            archived: true,
        };
        await expect(dao.editItem(item)).rejects.toThrow("500");
    });

    test("test edit item item not found", async () => {
        const item = {
            id: 5,
            title: "some title",
            done: false,
            archived: true,
        };
        await expect(dao.editItem(item)).rejects.toThrow("404");
    });

    test("test edit item invalid response data", async () => {
        const item = {
            id: 999, // returns invalid response
            title: "some title",
            done: false,
            archived: true,
        };
        await expect(dao.editItem(item)).rejects.toThrow(
            InvalidResponseDataError
        );
    });

    test("test delete item internal error", async () => {
        await expect(dao.deleteItem(1)).rejects.toThrow("500");
    });

    test("test delete item not found", async () => {
        await expect(dao.deleteItem(5)).rejects.toThrow("404");
    });

    test("archive done items internal error", async () => {
        await expect(dao.archiveDoneItems()).rejects.toThrow("500");
    });
});
