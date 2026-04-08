import { setupServer, type SetupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { TodoItemData } from "../types";

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
        })
    );
};
