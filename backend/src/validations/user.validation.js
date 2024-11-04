import Joi from "joi";

const getUserByEmail = {
	body: Joi.object().keys({
		email: Joi.string().required(),
	}),
};
const getUserById = {
	params: Joi.object().keys({
		userId: Joi.string().required(),
	}),
};
const updateProfile = {
	body: Joi.object().keys({
		userData: Joi.object()
			.keys({
				name: Joi.string().min(2).max(30).optional(),
				email: Joi.string().email().forbidden(),
				password: Joi.string().min(6).forbidden(),
				phone: Joi.number().optional(),
				address: Joi.string().optional(),
				avatar: Joi.string().optional(),
				gender: Joi.string().optional(),
				birthDate: Joi.date().optional(),
			})
			.required(),
	}),
};

const updatePassword = {
	body: Joi.object().keys({
		oldPassword: Joi.string().required(),
		newPassword: Joi.string().required(),
	}),
};

export default {
	getUserByEmail,
	getUserById,
	updateProfile,
	updatePassword,
};
