"use strict";

const VALIDATION_OPTIONS = {
    abortEarly: false,
    stripUnknown: true, 
    errors: {
        escapeHtml: true
    }
};

const {userSchema} = require("./userValidator");
const {loginSchema} = require("./loginValidator");
const {characterSchema} = require("./characterValidator")
const schemas = {
    userSchema,
    loginSchema,
    characterSchema
};

exports.schemas = schemas;
exports.VALIDATION_OPTIONS = VALIDATION_OPTIONS;