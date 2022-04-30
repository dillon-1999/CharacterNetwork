"use strict";
const Joi = require('joi');

exports.characterSchema = Joi.object({
    name: Joi.string().min(1).required(),
    eyeColor: Joi.string().required(),
    hairColor: Joi.string().required(),
    skinColor: Joi.string().required(),
    feetTall: Joi.number().integer().min(0).required(),
    inchesTall: Joi.number().integer().min(0).required(),
    gender: Joi.string().required(),
    characterTraits: Joi.string().allow('', null),
    backstory: Joi.string().allow('', null)
});