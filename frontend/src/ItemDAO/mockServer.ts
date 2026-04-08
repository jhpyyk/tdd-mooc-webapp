import { setupServer, type SetupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { TodoItemData } from "../types";

export const createMockServer = (
    baseUrl: string,
    initialItems: TodoItemData[]
): SetupServer => {
    const mockServer = setupServer(
        http.get(`${baseUrl}/items`, () => {
            return HttpResponse.json(initialItems);
        }),
        http.get(`${baseUrl}/items/items?archived=false`, () => {
            return HttpResponse.json([initialItems[0], initialItems[1]]);
        }),
        http.get(`${baseUrl}/items/items?archived=false`, () => {
            return HttpResponse.json([initialItems[2], initialItems[3]]);
        })
    );
    return mockServer;
};
