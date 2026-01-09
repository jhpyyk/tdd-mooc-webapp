import { useEffect, useState } from "react";
import TodoItem from "./components/TodoItem/TodoItem";
import AddItemForm from "./components/AddItemForm/AddItemForm";
// const api_url = "http://localhost:3001";
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
        <>
            <AddItemForm />
            <TodoItem title="item1"></TodoItem>
            <p>Hello from frontend</p>
            <p>{backendTestResponse}</p>
            <p>{dbHealthResponse}</p>
        </>
    );
};

export default App;
