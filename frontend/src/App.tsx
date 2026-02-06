import TodoPage from "./components/TodoPage/TodoPage";
import "./App.css";
import { LocalItemDAO, type ItemDAO } from "./ItemDAO";
import ArchivePage from "./components/Archive/ArchivePage";
import { Route, Router, type BaseLocationHook } from "wouter";
import E2EPage from "./components/E2EPage";

const localItemDAO = new LocalItemDAO();

interface AppProps {
    itemDAO: ItemDAO;
    routerHook?: BaseLocationHook;
}

const App = ({ itemDAO = localItemDAO, routerHook }: AppProps) => {
    return (
        <div className="app-container">
            <div className="page-container">
                <Router hook={routerHook}>
                    <Route path={"/todo"}>
                        <TodoPage itemDAO={itemDAO} />
                    </Route>
                    <Route path={"/archive"}>
                        <ArchivePage itemDAO={itemDAO} />
                    </Route>
                    <Route path={"/e2e"}>
                        <E2EPage />
                    </Route>
                </Router>
            </div>
        </div>
    );
};

export default App;
