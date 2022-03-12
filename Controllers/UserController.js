"use strict";
const argon2 = require("argon2");
const { userModel } = require("../Models/UserModel");
const { characterModel } = require("../Models/CharacterModel");
const { projectModel } = require("../Models/ProjectModel");
const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../userAvatars');
    },

    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(12).toString('hex');
        const [extension] = file.originalname.split(".").slice(-1);
        cb(null, `${randomName}.${extension}`);
    },

    fileFilter: (req, file, cb) => {
        if(!req.session){
            return cb(null, false);
        }
        const [extension] = file.originalname.split(".").slice(-1);
        if(extension != 'jpg'){
            return cb(null, false)
        } else {
            cb(null, true);
        }
    }
});

let upload = multer({storage});

module.exports = (app) =>{
    app.get('/newUser', async (req, res) => {
        res.render('newUser');
    });

    app.get('/users/homepage', async (req, res) => {
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
    app.post('/upgrade', async (req, res) => {
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
    app.post('/revoke', async (req, res) => {
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

    app.post('/users/uploadImage/', upload.single('file'), (req,res) => {
        if(!req.session.userID){
            return res.sendStatus(404);
        }
        try{
            const previousFile = userModel.getAvatarHash(req.session.userID);
            const didUpload = userModel.uploadAvatar(req.session.userID, req.file.filename);
            if(didUpload){
                if(previousFile){ // this deletes the old file 
                    fs.unlinkSync(`../userAvatars/${previousFile.avatarAddress}`);
                }
                return res.sendStatus(200);
            } else {
                return res.sendStatus(400);
            }

        } catch(e){
            res.send(e);
        }
    });

}