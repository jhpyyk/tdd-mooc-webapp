import { useState, useEffect } from "react";

const api_host = import.meta.env.VITE_API_HOST;
const api_port = import.meta.env.VITE_API_PORT;
const api_url = `http://${api_host}:${api_port}`;
console.log("API_URL", api_url);

interface TestResponse {
    message: string;
}
const fetchTest = async (): Promise<TestResponse> => {
    const res: Response = await fetch(`${api_url}/test`);
    console.log(res);
    const data = await res.json();
    return data;
};

const fetchGoAPITest = async (): Promise<TestResponse> => {
    const res = await fetch(`http://${api_host}:5000/test`);
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
const fetchGoAPIDbHealth = async (): Promise<TestResponse> => {
    console.log("fetching db-health");
    const res = await fetch(`${api_url}/db-health`);
    console.log(res);
    const data = await res.json();
    return data;
};
const E2EPage = () => {
    const [backendTestResponse, setBackendTestResponse] = useState<string>();
    const [goBackendTestResponse, setGoBackendTestResponse] =
        useState<string>();
    const [dbHealthResponse, setDbHealthResponse] = useState<string>();
    const [goApidbHealthResponse, setGoApiDbHealthResponse] =
        useState<string>();

    useEffect(() => {
        const fetchBackendResponse = async () => {
            const testResponse = await fetchTest();
            console.log(testResponse);

            setGoBackendTestResponse(testResponse.message);
        };
        fetchBackendResponse();
    }, []);

    useEffect(() => {
        const fetchBackendResponse = async () => {
            const testResponse = await fetchGoAPITest();
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

    useEffect(() => {
        const fetchGoAPIDbHealthResponse = async () => {
            const testResponse = await fetchGoAPIDbHealth();
            console.log(testResponse);

            setGoApiDbHealthResponse(testResponse.message);
        };
        fetchGoAPIDbHealthResponse();
    }, []);

    return (
        <div>
            <h2>e2e stuff:</h2>
            <p>Hello from frontend</p>
            <p>{backendTestResponse}</p>
            <p>{goBackendTestResponse}</p>
            <p>{dbHealthResponse}</p>
            <p>{goApidbHealthResponse}</p>
        </div>
    );
};
export default E2EPage;
