import { useEffect, useState } from "react";
import TodoPage from "./components/TodoPage/TodoPage";
import "./App.css";
import { LocalItemDAO } from "./ItemDAO";

const api_host = import.meta.env.VITE_API_HOST;
const api_port = import.meta.env.VITE_API_PORT;
const api_url = `http://${api_host}:${api_port}`;
console.log("API_URL", api_url);

interface TestResponse {
    message: string;
}
const fetchTest = async (): Promise<TestResponse> => {
    const res = await fetch(`${api_url}/test`);
    console.log(res);
    const data = await res.json();
    return data;
};

const fetchDbHealth = async (): Promise<TestResponse> => {
    console.log("fetching db-health");
    const res = await fetch(`${api_url}/db-health`);
    console.log(res);
    const data = await res.json();
    return data;
};

const localItemDAO = new LocalItemDAO();

const App = () => {
    const [backendTestResponse, setBackendTestResponse] = useState<string>();
    const [dbHealthResponse, setDbHealthResponse] = useState<string>();

    useEffect(() => {
        const fetchBackendResponse = async () => {
            const testResponse = await fetchTest();
            console.log(testResponse);

            setBackendTestResponse(testResponse.message);
        };
        fetchBackendResponse();
    }, []);

    useEffect(() => {
        const fetchDbHealthResponse = async () => {
            const testResponse = await fetchDbHealth();
            console.log(testResponse);

            setDbHealthResponse(testResponse.message);
        };
        fetchDbHealthResponse();
    }, []);

    return (
        <div className="app-container">
            <TodoPage itemDAO={localItemDAO} />
            <h2>e2e stuff:</h2>
            <p>Hello from frontend</p>
            <p>{backendTestResponse}</p>
            <p>{dbHealthResponse}</p>
        </div>
    );
};

export default App;
