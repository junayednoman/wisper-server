import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import routeNotFoundHandler from "./middlewares/routeNotFoundHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://72.244.153.29:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send({
    message: "Welcome to Wisper server 🛢️!",
  });
});

app.use("/api/v1", router);
app.use("/.well-known", express.static(".well-known"));

app.use(globalErrorHandler);
app.use(routeNotFoundHandler);

export default app;
