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

const allowedOrigins = [process.env.DEV_BASE_URL, process.env.PROD_BASE_URL];

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
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
