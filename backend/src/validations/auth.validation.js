import Joi from "joi";

const signup = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string()
			.required()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
		password: Joi.string().required(),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string()
			.required()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
		password: Joi.string().required(),
	}),
};

const verifyOTP = {
	body: Joi.object().keys({
		OTPCode: Joi.number().required(),
	}),
};

const verifyEmail = {
	body: Joi.object().keys({
		email: Joi.string()
			.required()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
	}),
};

const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string()
			.required()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			}),
	}),
};

export default {
	signup,
	login,
	verifyOTP,
	forgotPassword,
	verifyEmail,
};
