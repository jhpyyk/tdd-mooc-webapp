import TodoPage from "./components/TodoPage/TodoPage";
import "./App.css";
import { ItemDAOImpl, type ItemDAO } from "./ItemDAO/ItemDAO";
// import { LocalItemDAO } from "./ItemDAO/LocalItemDAO";
import ArchivePage from "./components/Archive/ArchivePage";
import { Route, Router, type BaseLocationHook } from "wouter";
import E2EPage from "./components/E2EPage";

// const localItemDAO = new LocalItemDAO(undefined, 500);
const api_host = import.meta.env.VITE_API_HOST;
const api_port = import.meta.env.VITE_API_PORT;
const api_url = `http://${api_host}:${api_port}`;
const itemDao = new ItemDAOImpl(api_url);

interface AppProps {
    itemDAO?: ItemDAO;
    routerHook?: BaseLocationHook;
}

const App = ({ itemDAO = itemDao, routerHook }: AppProps) => {
    return (
        <div className="app-container">
            <div className="page-container">
                <Router hook={routerHook}>
                    <Route path={"/"}>
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
