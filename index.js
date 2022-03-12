"use strict";

require("dotenv").config();
const isProduction = process.env.MODE === "production";
const express = require("express");
const app = express();
const path = require("path");
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let client = redis.createClient();

const sessionConfig = {
    store: new RedisStore({ client: client }),
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
app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"), {
    extensions: ['html'],
}));
app.use(express.static("characterAvatars"));
app.use(express.static("userAvatars"));

app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
  )
app.use(
"/js",
express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
)
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")))

require("./Controllers/UserController.js")(app);
require("./Controllers/FriendController.js")(app);
// require("./Controllers/ProjectController.js")(app);
require("./Controllers/CharacterController.js")(app);
// require("./Controllers/FavoriteController.js")(app);
// require("./Controllers/StarsInController.js")(app);


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/createUser', (req, res) => {
    res.render('createUser');
})

app.get('/search', (req, res) => {
    res.render('searchPage');
})
app.listen(process.env.PORT, () => {
    console.log(`server lisening on http://localhost:${process.env.PORT} `);
});