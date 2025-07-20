import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./src/router/route";
import AppError from "./src/utils/AppError";
import globalErrorHandler from "./src/controllers/error.controller";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(morgan("dev"));
app.disable("x-powered-by");

app.use((req, res, next) => {
  next();
});

app.use("/api", router);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
