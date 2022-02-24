"use strict";
const argon2 = require("argon2");
const { resetWatchers } = require("nodemon/lib/monitor/watch");
const { friendModel } = require("../Models/FriendModel");
const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.post('/users/friendUser/:friendID', async (req, res) => {
        console.log("POST /users/friendUser");
        // add friend validation
        if(!req.session.isLoggedIn){
            return res.sendStatus(404);
        }

        const {friendID} = req.params;
        const userID = req.session.userID;
        try{
            const added = friendModel.createFriend(userID, friendID);
            added ? res.sendStatus(200) : res.sendStatus(400);
        } catch (e){
            console.log(e);
            return res.sendStatus(500);
        }
    });

    app.get('/users/friends', async (req,res) => {
        console.log("GET /users/friends");
        if(!req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        const userID = req.session.userID;
        try{
            const friends = friendModel.getUsersFriends(userID);
            return res.status(200).json(friends);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });
}