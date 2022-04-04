"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class StarsInModel {
    constructor(db){
        this.db = db;
    }

    addStar(projectID, charID){
        try {
            const sql = 'INSERT INTO StarsIn (projectID, charID) VALUES (@projectID, @charID)';
            db.prepare(sql).run({projectID, charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    removeStar(charID){
        try {
            const sql = 'DELETE FROM StarsIn WHERE charID=@charID';
            db.prepare(sql).run({charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    removeAllProjectStars(projectID){
        try {
            const sql = 'DELETE FROM StarsIn WHERE projectID=@projectID';
            db.prepare(sql).run({projectID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    // this should really be in CharacterModel
    getCharactersByProject(projectID){
        try {
            const sql = `SELECT name, charAvatar, Characters.charID
                         FROM Characters
                         JOIN StarsIn ON StarsIn.charID = Characters.charID AND StarsIn.projectID=@projectID;
            `;
            return db.prepare(sql).all({projectID});
        } catch (e){
            console.error(e);
            return false;
        }
    }

    getProjectByChar(charID){
        try {
            const sql = `SELECT projectID FROM StarsIn WHERE charID=@charID`;
            return db.prepare(sql).get({charID});
        } catch (e){
            console.error(e);
            return false;
        }
    }

}

exports.starsInModel = new StarsInModel(db);