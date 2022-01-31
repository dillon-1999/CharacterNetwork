"use strict";

const express = require("express");
const charactersRouter = express.Router();
const argon2 = require("argon2");
const { characterModel } = require("../Models/CharacterModel");

module.exports = charactersRouter;