interface TodoItemProps {
    title: string;
}
const TodoItem = (props: TodoItemProps) => {
    return <p>{props.title}</p>;
};

export default TodoItem;
