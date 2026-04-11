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

        http.put(`${baseUrl}/items/:id`, async ({ params, request }) => {
            const item = (await request.json()) as TodoItemData;
            const id = Number(params.id);

            return HttpResponse.json({ ...item, id: id });
        }),

        http.post(`${baseUrl}/archive-done`, async () => {
            return new HttpResponse(null, { status: 200 });
        }),
        http.delete(`${baseUrl}/items/:id`, async () => {
            return new HttpResponse(null, { status: 200 });
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
        http.post(`${baseUrl}/items`, async ({ request }) => {
            const body = (await request.json()) as { title: string };
            if (body.title == "invaliddata") {
                return HttpResponse.json({ invalidData: true });
            }
            return HttpResponse.json(
                { message: "error adding item" },
                { status: 500 }
            );
        }),
        http.put(`${baseUrl}/items/:id`, async ({ params }) => {
            const id = Number(params.id);
            if (id == 5) {
                return HttpResponse.json(
                    { message: "item not found" },
                    { status: 404 }
                );
            }
            if (id == 999) {
                return HttpResponse.json({ invalidData: true });
            }
            return HttpResponse.json(
                { message: "error editing item" },
                { status: 500 }
            );
        }),
        http.delete(`${baseUrl}/items/:id`, async ({ params }) => {
            const id = Number(params.id);
            if (id == 5) {
                return HttpResponse.json(
                    { message: "item not found" },
                    { status: 404 }
                );
            }
            return HttpResponse.json(
                { message: "error editing item" },
                { status: 500 }
            );
        }),
        http.post(`${baseUrl}/archive-done`, async () => {
            return HttpResponse.json(
                { message: "error archiving done items" },
                { status: 500 }
            );
        })
    );
};
