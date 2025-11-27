import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await expect(page).toHaveTitle(/todo-list/);
});

test("frontend fetches text from backend", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    expect(page.getByText("hello from backend")).toBeVisible();
});
