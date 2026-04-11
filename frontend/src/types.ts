export type TodoItemData = {
    id: number;
    title: string;
    done: boolean;
    archived: boolean;
};

export type TodoItemDataNoId = Omit<TodoItemData, "id">;

export const validateTodoItemData = (obj: any): string[] => {
    const errors: string[] = [];

    if (obj == null || typeof obj !== "object") {
        return ["response is not an object"];
    }

    if (typeof obj.id !== "number" || !Number.isInteger(obj.id)) {
        errors.push(`id must be an integer, got ${JSON.stringify(obj.id)}`);
    }
    if (typeof obj.title !== "string") {
        errors.push(`title must be a string, got ${JSON.stringify(obj.title)}`);
    }
    if (typeof obj.done !== "boolean") {
        errors.push(`done must be a boolean, got ${JSON.stringify(obj.done)}`);
    }
    if (typeof obj.archived !== "boolean") {
        errors.push(
            `archived must be a boolean, got ${JSON.stringify(obj.archived)}`
        );
    }

    return errors;
};
