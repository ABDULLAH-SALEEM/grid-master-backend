import "module-alias/register";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import api from "./api";
import { initDb } from "./common/database";
import errorHandler from "./middlewares/error.handler";
import responseHandler from "./middlewares/generate-response";
initDb();

const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: any,
    callback: (arg0: null, arg1: boolean) => void
  ) {
    callback(null, true);
  },
  methods: "GET,PUT,POST,DELETE,PATCH",
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, Credentials",
};
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(errorHandler);
app.use(responseHandler);
app.use("/api", api);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

export default app;
