import { useState } from "react";
import type { ItemDAO } from "../../ItemDAO";
import ItemList from "../ItemList/ItemList";
import type { TodoItemData } from "../../types";

interface ArchivePageProps {
    itemDAO: ItemDAO;
}
const ArchivePage = ({ itemDAO }: ArchivePageProps) => {
    const [itemData, _] = useState<TodoItemData[]>(itemDAO.getArchivedItems());
    return <ItemList itemData={itemData} editItem={() => {}} />;
};

export default ArchivePage;
