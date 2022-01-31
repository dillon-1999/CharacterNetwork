"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class FavoriteModel {
    constructor(db){
        this.db = db;
    }

    createFavorite(userID, charID){
        try {
            const sql = `INSERT INTO Favorites (userID, charID)
                         VALUES (@userID, charID)`;
            db.prepare(sql).run({userID, charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    unFavorite(userID, charID){
        try {
            const sql = `DELETE FROM Favorites
                         WHERE userID=@userID
                               and 
                               charID=@charID`;
            db.prepare(sql).run({userID, charID});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getUsersFavorites(userID){
        try {
            const sql = `SELECT charID FROM Favorites WHERE userID=@userID`;
            return db.prepare(sql).all({userID});
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

exports.favoriteModel = new FavoriteModel(db);