interface TodoItemProps {
    title: string;
}
const TodoItem = (props: TodoItemProps) => {
    return (
        <div>
            <input type="checkbox" aria-label={`checkbox-${props.title}`} />
            <p>{props.title}</p>
        </div>
    );
};

export default TodoItem;
