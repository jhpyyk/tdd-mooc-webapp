import { useEffect, useState } from "react";
import TodoPage from "./components/TodoPage/TodoPage";
import "./App.css";
import { LocalItemDAO, type ItemDAO } from "./ItemDAO";
import ArchivePage from "./components/Archive/ArchivePage";
import { Route, Router, type BaseLocationHook } from "wouter";

const localItemDAO = new LocalItemDAO();

interface AppProps {
    itemDAO: ItemDAO;
    routerHook?: BaseLocationHook;
}

const App = ({ itemDAO = localItemDAO, routerHook }: AppProps) => {
    return (
        <div className="app-container">
            <Router hook={routerHook}>
                <Route path={"/todo"}>
                    <TodoPage itemDAO={itemDAO} />
                </Route>
                <Route path={"/archive"}>
                    <ArchivePage itemDAO={itemDAO} />
                </Route>
            </Router>
        </div>
    );
};

export default App;
