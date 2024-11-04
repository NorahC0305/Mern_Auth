import mongoose from "mongoose";
import logger from "../configs/logger.config.js";

const connectDB = async () => {
	try {
		console.log(process.env.MONGO_URI);
		const { connection } = await mongoose.connect(process.env.MONGO_URI);
		logger.info(`MongoDB Connected: ${connection.host}`);
	} catch (error) {
		logger.error("Error while connecting", error);
		process.exit(1);
	}
};
export default connectDB;
