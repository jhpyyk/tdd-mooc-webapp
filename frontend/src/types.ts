export type TodoItemData = {
    id: number;
    title: string;
    done: boolean;
    archived: boolean;
};

export type TodoItemDataNoId = Omit<TodoItemData, "id">;
