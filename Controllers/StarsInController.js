"use strict";

const express = require("express");
const starsInRouter = express.Router();
const argon2 = require("argon2");
const { starsInModel } = require("../Models/StarsInModel");

module.exports = starsInRouter;