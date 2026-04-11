import { test, expect } from "@playwright/test";

test("happy path", async ({ page }) => {
    const itemTitleTdd = "tdd";
    const editedTddTitle = "tdd edited";
    const itemTitleAnother = "another item";

    await test.step("has title", async () => {
        await page.goto("http://localhost:5173/");
        await expect(page).toHaveTitle(/todo-list/);
    });

    await test.step("add items", async () => {
        const addItemInput = page.getByRole("textbox", { name: /add/i });
        const addItemButton = page.getByRole("button", { name: /add/i });

        await addItemInput.fill(itemTitleTdd);
        await addItemButton.click();

        await addItemInput.fill(itemTitleAnother);
        await addItemButton.click();

        expect(page.getByText(itemTitleTdd)).toBeVisible();
        expect(page.getByText(itemTitleAnother)).toBeVisible();
    });

    await test.step("edit item title", async () => {
        const itemTdd = page.getByRole("listitem", { name: itemTitleTdd });
        await itemTdd.getByRole("button", { name: /edit/i }).click();

        const editField = itemTdd.getByRole("textbox");
        await editField.fill(editedTddTitle);

        await itemTdd.getByRole("button", { name: /save/i }).click();

        await expect(
            page.getByRole("listitem", { name: editedTddTitle })
        ).toBeVisible();
    });

    await test.step("mark item as done", async () => {
        const itemTdd = page.getByRole("listitem", { name: editedTddTitle });
        const tddItemCheckbox = itemTdd.getByRole("checkbox");
        await tddItemCheckbox.check();

        await expect(tddItemCheckbox).toBeChecked();
    });

    await test.step("archive done items", async () => {
        await page.getByRole("button", { name: /archive/i }).click();

        await expect(
            page.getByRole("listitem", { name: editedTddTitle })
        ).not.toBeVisible();
        await expect(
            page.getByRole("listitem", { name: itemTitleAnother })
        ).toBeVisible();
    });
});
