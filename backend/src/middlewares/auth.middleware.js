import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

class AuthMiddleware {
	auth(...requiredRoles) {
		return async (req, res, next) => {
			const token =
				req.cookies.access_token ||
				req.headers.authorization?.split(" ")[1] ||
				req.headers.authorization ||
				req.query.token;
			if (!token) {
				return res.status(401).json({
					status: "fail",
					message: "No token provided, please log in",
				});
			}

			try {
				const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
				const user = await userModel.findById(decoded.userId);

				if (!user) {
					return res.status(401).json({
						status: "fail",
						message: "User no longer exists",
					});
				}

				if (!user.isVerified) {
					return res.status(403).json({
						status: "fail",
						message: "Please verify your email to proceed",
					});
				}

				if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
					return res.status(403).json({
						status: "fail",
						message: `Access denied. Only users with the following roles are allowed: ${requiredRoles.join(", ")}`,
					});
				}

				req.user = user;
				next();
			} catch (error) {
				return res.status(401).json({
					status: "fail",
					message: "Invalid or expired token",
				});
			}
		};
	}
}

export default new AuthMiddleware();
