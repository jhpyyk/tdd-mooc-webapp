import type { TodoItemData } from "../types";
import { ItemDAOImpl, type ItemDAO } from "./ItemDAO";
import { createMockServer } from "./mockServer";

describe("Test item DAO", () => {
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
    const mockServer = createMockServer(baseUrl, initialItems);

    beforeAll(() => mockServer.listen());
    afterEach(() => mockServer.resetHandlers());
    afterAll(() => mockServer.close());

    test("test get all items", async () => {
        const dao = new ItemDAOImpl(baseUrl);
        const items = await dao.getAllItems();
        expect(items).toEqual(initialItems);
    });
});
