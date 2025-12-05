import express, { Request, Response } from "express";
import cors from "cors";
import { DB } from "./db";

const port = process.env.PORT;

const app = express();
app.use(cors());

const db = new DB();

app.get("/test", (req: Request, res: Response) => {
    res.json({ message: "Hello from backend" });
});

app.get("/db-health", async (req: Request, res: Response) => {
    const dbStatus = await db.healthCheck();
    if (dbStatus) {
        res.json({ message: "DB connection is healthy" });
    } else {
        res.status(500).json({
            message: "Something is wrong with DB connection",
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
