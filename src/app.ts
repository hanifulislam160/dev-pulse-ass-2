import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Devpulse Assignment 2");
});

export default app;
