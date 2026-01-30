export type TodoItemData = {
    id: number;
    title: string;
    done: boolean;
};

export type TodoItemDataNoId = Omit<TodoItemData, "id">;
