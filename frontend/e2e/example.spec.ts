import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173/e2e");

    await expect(page).toHaveTitle(/todo-list/);
});

test("frontend fetches text from backend", async ({ page }) => {
    await page.goto("http://localhost:5173/e2e");
    await expect(page.getByText("Hello from backend")).toBeVisible();
});

test("frontend fetches text from go backend", async ({ page }) => {
    await page.goto("http://localhost:5173/e2e");
    await expect(page.getByText("Hello from go backend")).toBeVisible();
});

test("frontend-backend-db connection works", async ({ page }) => {
    await page.goto("http://localhost:5173/e2e");
    await expect(page.getByText("DB connection is healthy")).toBeVisible();
});
