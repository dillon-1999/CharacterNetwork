"use strict";
const argon2 = require("argon2");
const { userModel } = require("../Models/UserModel");
const { friendModel } = require("../Models/FriendModel");
const { characterModel } = require("../Models/CharacterModel");
const { projectModel } = require("../Models/ProjectModel");

const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.get('/newUser', (req, res) => {
        res.render('newUser');
    });

    app.get('/users/homepage', (req, res) => {
        // send:
        // individual characters, projects, some userInfo
        // const friends = friendModel.getUsersFriends(req.session.userID);
        const chars = characterModel.getCharsByUser(req.session.userID);
        const projects = projectModel.getUsersProjects(req.session.userID);
        const userInfo = userModel.getUserData(req.session.userID);
        try {
            res.render('homepage', {session: req.session, chars, projects, userInfo});
        } catch(e){
            console.error(e);
            return res.sendStatus(500)
        }
    });

    app.post('/newUser/attemptRegister', async (req, res) => {
        console.log("POST /newUser/attemptRegister");
        const {value, error} = schemas.userSchema.validate(req.body, VALIDATION_OPTIONS); 
        if (error){
            const errorMessages = error.details.map(error => error.message);
            return res.status(400).json(errorMessages);
        }

        const {email, password, username} = value;

        try {
            const passwordHash = await argon2.hash(password, {hashLength: 5});
            const added = userModel.createUser({username, passwordHash, email});
            added ? res.redirect('/login') : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });

    app.post("/login", async (req, res) => {
        console.log(req.body);
        const {value, error} = schemas.loginSchema.validate(req.body, VALIDATION_OPTIONS);
        if(error){
            const errorMessages = error.details.map(error => error.message);
            console.log(errorMessages);
            return res.status(400).json(errorMessages);
        }
        const {email, password} = value;
        
        try{
            const pass = userModel.getPasswordHash(email);
            if(!pass){
                return res.sendStatus(400);
            }

            const {passwordHash} = pass;
            if(await argon2.verify(passwordHash, password)){
                const {userID, username, role} = userModel.getUserDataByEmail(email);
                console.log(userID);
                console.log(username);
                console.log(role);
                req.session.regenerate((err) => {
                    if(err){
                        res.sendStatus(401);
                        return console.error(err);
                    }
                    req.session.userID = userID;
                    req.session.email = email;
                    req.session.username = username;
                    req.session.role = role;
                    req.session.isLoggedIn = true;
                    res.redirect('/users/homepage');
                });
            } else {
                return res.sendStatus(400);
            }
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });

    // query param as userID
    app.post('/upgrade', (req, res) => {
        if(req.session.role !== 1 || !req.query.userID){ // just an admin functionality
            return res.sendStatus(404);
        }

        try {
            const upgraded = userModel.updateUser(req.query.userID, {role: 1});
            if(upgraded){
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        } catch(err) {
            console.error(err);
            return res.sendStatus(500);
        }
    });

    // expects query param userID
    app.post('/revoke', (req, res) => {
        if(req.session.role !== 1 || !req.query.userID){ // just an admin functionality
            return res.sendStatus(404);
        }

        try {
            const upgraded = userModel.updateUser(req.query.userID, {role: 0});
            if(upgraded){
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        } catch(err) {
            console.error(err);
            return res.sendStatus(500);
        }
    });

    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if(err){
                res.sendStatus(500);
                return console.error(err);
            }
            res.redirect('/login');
        })
    });
}