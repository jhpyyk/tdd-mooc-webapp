import { useState } from "react";
import type { ItemDAO } from "../../ItemDAO";
import ItemList from "../ItemList/ItemList";
import type { TodoItemData } from "../../types";
import { Link } from "wouter";

interface ArchivePageProps {
    itemDAO: ItemDAO;
}
const ArchivePage = ({ itemDAO }: ArchivePageProps) => {
    const [itemData, _] = useState<TodoItemData[]>(itemDAO.getArchivedItems());
    return (
        <div>
            <Link href="/todo">Todo</Link>
            <h2>Archive</h2>
            <ItemList itemData={itemData} editItem={() => {}} />
        </div>
    );
};

export default ArchivePage;
