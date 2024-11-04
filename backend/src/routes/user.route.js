import express from "express";
const router = express.Router();
import AuthMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import userValidation from "../validations/user.validation.js";
import UserController from "../controllers/user.controller.js";
import ROLE from "../configs/roles.config.js";

router.use(AuthMiddleware.auth());

router.get("/getAllUser", UserController.getAllUser);
router.get("/getMe", UserController.getMe);
router.get(
	"/getUserById/:userId",
	validate(userValidation.getUserById),
	UserController.getUserById,
);
router.get(
	"/getUserByEmail",
	validate(userValidation.getUserByEmail),
	UserController.getUserByEmail,
);
router.patch(
	"/updateProfile/",
	validate(userValidation.updateProfile),
	UserController.updateProfile,
);
router.patch(
	"/updatePassword",
	validate(userValidation.updatePassword),
	UserController.updatePassword,
);

export default router;
