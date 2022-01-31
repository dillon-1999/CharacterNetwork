"use strict";

const express = require("express");
const friendsRouter = express.Router();
const argon2 = require("argon2");
const { friendModel } = require("../Models/FriendModel");

module.exports = friendsRouter;