import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		teacher: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		discount: {
			type: Number,
			default: 0,
		},
		students: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		level: {
			type: String,
			enum: ["beginner", "intermediate", "advanced"],
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Course", courseSchema);
