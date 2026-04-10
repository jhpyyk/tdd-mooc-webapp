import { setupServer, type SetupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { TodoItemData } from "../types";
import type TodoItem from "../components/items/TodoItem/TodoItem";

export const createMockServerSuccess = (
    baseUrl: string,
    initialItems: TodoItemData[]
): SetupServer => {
    return setupServer(
        http.get(`${baseUrl}/items`, ({ request }) => {
            const archived = new URL(request.url).searchParams.get("archived");

            if (archived === "false") {
                return HttpResponse.json([initialItems[0], initialItems[1]]);
            }
            if (archived === "true") {
                return HttpResponse.json([initialItems[2], initialItems[3]]);
            }
            return HttpResponse.json(initialItems);
        }),
        http.post(`${baseUrl}/items`, async ({ request }) => {
            const body = (await request.json()) as { title: string };

            const item = {
                id: 5,
                title: body.title,
                done: false,
                archived: false,
            };

            return HttpResponse.json(item);
        }),
        http.post(`${baseUrl}/items/:id`, async ({ request }) => {
            const item = (await request.json()) as TodoItemData;

            return HttpResponse.json(item);
        })
    );
};

export const createMockServerThrowsError = (baseUrl: string): SetupServer => {
    return setupServer(
        http.get(`${baseUrl}/items`, () => {
            return HttpResponse.json(
                { message: "error getting items" },
                { status: 500 }
            );
        }),
        http.post(`${baseUrl}/items`, () => {
            return HttpResponse.json(
                { message: "error adding item" },
                { status: 500 }
            );
        })
    );
};
