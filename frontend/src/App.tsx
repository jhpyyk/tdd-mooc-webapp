import { useEffect, useState } from "react";
const api_url = "http://localhost:3001";
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

const App = () => {
    const [backendTestResponse, setBackendTestResponse] = useState<string>();
    useEffect(() => {
        const fetchBackendResponse = async () => {
            const testResponse = await fetchTest();
            console.log(testResponse);

            setBackendTestResponse(testResponse.message);
        };
        fetchBackendResponse();
    });
    return (
        <>
            <p>Hello from frontend</p>
            <p>{backendTestResponse}</p>
        </>
    );
};

export default App;
