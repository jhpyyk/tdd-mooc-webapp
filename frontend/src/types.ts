export type TodoItemData = {
    id: number;
    title: string;
};

export type TodoItemDataNoId = Omit<TodoItemData, "id">;
