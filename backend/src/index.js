import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDB from "./db/connectDB.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import Routers from "./routes/index.js";
import morgan from "morgan";
import logger from "./configs/logger.config.js";

dotenv.config();
const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		exposedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
	res.send("Hello From Express");
});

app.use("/api", Routers);
app.use(errorHandler);

app.listen(PORT, () => {
	logger.info(`Server started on port http://localhost:${PORT}`);
	logger.info(`Email Server: ${process.env.EMAIL_SENDER}`);
});
