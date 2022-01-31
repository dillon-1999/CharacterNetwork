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
                         VALUES (@userID, friendID)`;
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
            const sql = `SELECT friendID, dateFriended FROM Friends WHERE userID=@userID`;
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
}

exports.friendModel = new FriendModel(db);