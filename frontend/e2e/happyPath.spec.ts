import { test, expect } from "@playwright/test";

test("happy path", async ({ page }) => {
    await test.step("has title", async () => {
        await page.goto("http://localhost:5173/");
        await expect(page).toHaveTitle(/todo-list/);
    });

    await test.step("add item", async () => {
        const itemTitle = "tdd";
        const addItemInput = page.getByRole("textbox", { name: /add/i });
        await addItemInput.fill(itemTitle);

        const addItemButton = page.getByRole("button", { name: /add/i });
        await addItemButton.click();

        expect(page.getByText(itemTitle)).toBeVisible();
    });
});
