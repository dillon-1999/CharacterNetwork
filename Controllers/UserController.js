"use strict";

const express = require("express");
const usersRouter = express.Router();
const argon2 = require("argon2");
const { userModel } = require("../Models/UserModel");

usersRouter.get("/", async (req, res) =>{
    res.send("users page!");
});


module.exports = usersRouter;