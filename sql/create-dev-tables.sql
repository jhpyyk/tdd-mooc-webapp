create table if not exists todo_items (
    id serial primary key,
    title text not null,
    done boolean not null default false,
    archived boolean not null default false
);
