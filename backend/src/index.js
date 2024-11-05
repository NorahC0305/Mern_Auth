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

// Set allowed origins based on environment
const allowedOrigins = [
	process.env.DEV_CLIENT_URL,
	process.env.PROD_CLIENT_URL,
];

// CORS Configuration
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				logger.warn(`Blocked by CORS: Origin ${origin}`);
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

// Set up port from environment
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Test route
app.get("/", (req, res) => {
	res.send("Hello From Express");
});

// API routes and error handler
app.use("/api", Routers);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
	logger.info(`Server started on port http://localhost:${PORT}`);
	if (process.env.NODE_ENV === "development") {
		logger.info(`Email Server: ${process.env.EMAIL_SENDER}`);
	}
});
