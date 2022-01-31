"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class CharacterModel {
    constructor (db){
        this.db = db;
    }

    createCharacter(character){
        try {
            const sql = `INSERT INTO Characters (
                charID, creator, name, eyeColor, hairColor, skinColor, 
                feetTall, inchesTall, gender, characterTraits, backstory
            ) values(@charID, @creator, @name, @eyeColor, @hairColor, @skinColor, 
                @feetTall, @inchesTall, @gender, @characterTraits, @backstory)`;
            character.charID = uuidV4();
            db.prepare(sql).run(character);
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    deleteCharacter(userID, charID){
        try {
            const sql = `DELETE FROM Characters WHERE userID=@userID AND charID=@charID`;
            db.prepare(sql).run({userID, charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    // create a function to update different attribute
    // in the same function
}

exports.characterModel = new CharacterModel(db)