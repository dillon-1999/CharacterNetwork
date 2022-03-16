"use strict";
// const argon2 = require("argon2");
const { friendModel } = require("../Models/FriendModel");
// const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.get('/users/friends', async (req, res) => {
        const friends = friendModel.getUsersFriends(req.session.userID);
        res.render('friends', {session: req.session, friends: friends});
    });

    app.post('/users/friendUser', async (req, res) => {
        console.log("POST /users/friendUser");
        // add friend validation
        if(!req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        
        const friendID = req.query.friendID;
        const userID = req.session.userID;
        const testFriend = friendModel.isFriend(friendID);
        console.log(testFriend);
        if(userID == friendID || !testFriend){ // cant friend themselves!
            return res.sendStatus(404);
        }
        
        try{ 
            const added = friendModel.createFriend(userID, friendID);
            added ? res.sendStatus(200) : res.sendStatus(400);
        } catch (e){
            console.log(e);
            return res.sendStatus(500);
        }
    });

    app.post('/users/unfriendUser', async (req, res) => {
        console.log("POST /users/unfriendUser");
        // add friend validation
        if(!req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        
        const friendID = req.query.friendID;
        const userID = req.session.userID;
        if(userID == friendID || !friendID){ // cant friend themselves!
            return res.sendStatus(404);
        }
        
        try{
            const added = friendModel.unFriend(userID, friendID);
            added ? res.sendStatus(200) : res.sendStatus(400);
        } catch (e){
            console.log(e);
            return res.sendStatus(500);
        }
    });
}