"use strict";
const Joi = require('joi');

exports.userSchema = Joi.object({
		email: Joi.string().email().lowercase().required(),
		password: Joi.string().min(8).required(),
		username: Joi.string().min(6).max(20).lowercase().required()
	}
);