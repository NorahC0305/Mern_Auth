import express from "express";
import AuthController from "../controllers/auth.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authValidation from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(authValidation.signup), AuthController.signup);
router.post(
	"/verify-otp",
	validate(authValidation.verifyOTP),
	AuthController.verifyOTP,
);
router.get(
	"/verify-email",
	validate(authValidation.verifyEmail),
	AuthController.verifyEmail,
);
router.post("/login", validate(authValidation.login), AuthController.login);
router.post("/logout", AuthController.logout);
router.post(
	"/forgot-password",
	validate(authValidation.forgotPassword),
	AuthController.forgotPassword,
);
router.post("/reset-password", AuthController.resetPassword);
router.post("/refresh-token", AuthController.refreshToken);

export default router;
