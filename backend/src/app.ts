import express, { Request, Response } from "express";
import cors from "cors";

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.get("/test", (req: Request, res: Response) => {
    res.json({ message: "hello from backend" });
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
