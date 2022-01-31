"use strict";

// allows the use of .env file
require("dotenv").config();
// will use later, variable depending on mode
const isProduction = process.env.MODE === "production";
// create and instantiate express (our backend framework)
const express = require("express");
const app = express();
// set the view engine, we will be using ejs
// allows the parsing of json
// allows parsing of url encoded bodies
// redis is our session store
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

const sessionConfig = {
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 8 // 8 hours
    }
};

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const usersRouter = require("./Controllers/UserController.js");
const friendsRouter = require("./Controllers/FriendController.js");
const projectsRouter = require("./Controllers/ProjectController.js");
const charactersRouter = require("./Controllers/CharacterController.js");
const favoritesRouter = require("./Controllers/FavoriteController.js");
const starsInRouter = require("./Controllers/StarsInController.js");

app.use(session(sessionConfig));
app.use('/users', usersRouter);
app.use('/friends', friendsRouter);
app.use('/projects', projectsRouter);
app.use('/characters', charactersRouter);
app.use('/favorites', favoritesRouter);
app.use('/starsIn', starsInRouter);

app.get('/', (req, res) => {
    res.send("hello, world");
});

app.listen(process.env.PORT, () => {
    console.log(`server lisening on http://localhost:${process.env.PORT} `);
});