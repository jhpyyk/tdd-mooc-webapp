import express, { Request, Response } from "express";

const app = express();

app.get("/test", (req: Request, res: Response) => {
    res.send("test");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});
