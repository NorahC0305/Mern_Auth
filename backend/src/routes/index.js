import express from "express";
const router = express.Router();
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";

const routes = [
	{
		path: "/auth",
		route: authRouter,
	},
	{
		path: "/users",
		route: userRouter,
	},
];

routes.forEach((route) => {
	router.use(route.path, route.route);
});
export default router;
