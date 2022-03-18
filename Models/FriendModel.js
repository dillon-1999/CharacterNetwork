"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class FriendModel {
    constructor(db){
        this.db = db;
    }

    createFriend(userID, friendID){
        try {
            const sql = `INSERT INTO Friends (userID, friendID)
                         VALUES (@userID, @friendID)`;
            db.prepare(sql).run({userID, friendID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    unFriend(userID, friendID){
        try {
            const sql = `DELETE FROM Friends
                         WHERE userID=@userID
                               and 
                               friendID=@friendID`;
            db.prepare(sql).run({userID, friendID});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getUsersFriends(userID){
        try {
            const sql = `SELECT friend.username, friendID, dateFriended FROM Friends, Users user, Users friend WHERE user.userID=@userID AND friendID=friend.userID`;
            return db.prepare(sql).all({userID});
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getDateFriended(userID, friendID){
        try{
            const sql = `SELECT dateFriended
                         FROM Friends
                         WHERE userID=@userID
                               and
                               friendID=@friendID
                        `;
            return db.prepare(sql).get({userID, friendID});
        } catch (e){
            console.error(e);
            return false;
        }
    }

    getFriends(){
        try {
            const sql = `SELECT * FROM Friends`;
            return db.prepare(sql).all();
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    isFriend(friendID){
        try{
            const sql = `SELECT * FROM Friends WHERE friendID=@friendID`;
            const friend = db.prepare(sql).get({friendID});
            return friend;
        } catch(e) {
            console.error(e);
            return false;
        }
    }
}
let x = new FriendModel(db);
console.log(x.getFriends())
exports.friendModel = new FriendModel(db);