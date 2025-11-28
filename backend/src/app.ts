import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/test", (req: Request, res: Response) => {
    res.json({ message: "hello from backend" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});
