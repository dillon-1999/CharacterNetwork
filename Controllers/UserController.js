"use strict";
const argon2 = require("argon2");
const { userModel } = require("../Models/UserModel");
const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.get('/newUser', (req, res) => {
        res.render('newUser');
    });
    app.get('/users/homepage', (req, res) => {
        res.render('homepage', {session: req.session});
    });

    // app.get('/users/friends', (req,res) => {

    // });

    app.post('/newUser/attemptRegister', async (req, res) => {
        console.log("POST /newUser/attemptRegister");
        const {value, error} = schemas.userSchema.validate(req.body, VALIDATION_OPTIONS); 
        console.log(req.body)
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
                    console.log(req.session)
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