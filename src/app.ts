import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";

const app: Application = express();

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("Devpulse Assignment 2");
});

export default app;
