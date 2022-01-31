"use strict";

const express = require("express");
const favoritesRouter = express.Router();
const argon2 = require("argon2");
const { favoriteModel } = require("../Models/FavoriteModel");

module.exports = favoritesRouter;