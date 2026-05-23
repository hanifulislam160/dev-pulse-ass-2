import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoutes } from "./modules/issues/issue.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("Devpulse Assignment 2");
});

app.use('/api', authRoute)
app.use("/api", issueRoutes);

app.use(globalErrorHandler);

export default app;
