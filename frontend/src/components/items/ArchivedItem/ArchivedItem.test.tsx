import { render, screen, within } from "@testing-library/react";
import type { TodoItemData } from "../../../types";
import ArchivedItem from "./ArchivedItem";

describe("ArchivedItem ", () => {
    const itemData: TodoItemData = {
        id: 1,
        title: "test title",
        done: false,
        archived: false,
    };
    test("checkbox should be disabled", () => {
        render(<ArchivedItem data={itemData} buttonOnClick={() => {}} />);

        const item = screen.getByRole("listitem");
        const checkbox = within(item).getByRole("checkbox");

        expect(checkbox).toBeDisabled();
    });
});
