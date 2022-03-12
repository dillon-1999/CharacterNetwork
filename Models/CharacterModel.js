"use strict";
const { options } = require("joi");
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class CharacterModel {
    constructor (db){
        this.db = db;
    }

    createCharacter(userID, character){
        try {
            const sql = `INSERT INTO Characters (
                charID, creator, name, eyeColor, hairColor, skinColor, 
                feetTall, inchesTall, gender, characterTraits, backstory
            ) values(@charID, @creator, @name, @eyeColor, @hairColor, @skinColor, 
                @feetTall, @inchesTall, @gender, @characterTraits, @backstory)`;
            character.charID = uuidV4();
            character.creator = userID;
            db.prepare(sql).run(character);
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    deleteCharacter(userID, charID){
        try {
            const sql = `DELETE FROM Characters WHERE creator=@userID AND charID=@charID`;
            db.prepare(sql).run({userID, charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    // create a function to update different attribute
    // in the same function
    updateCharacter(userID, charID, updatesObj){
        // valid options
        let options = ['name', 'eyeColor', 'hairColor', 'skinColor', 
            'feetTall', 'inchesTall', 'gender', 'characterTraits', 'backstory'];
        let validObj = {};
        for(const i in updatesObj){
            if(options.includes(i) && updatesObj[i]){
                validObj[i] = updatesObj[i];
            }
        }
        if(Object.keys(validObj).length === 0){
            return false;
        }
        let updates = Object.keys(validObj).map(x => x + `=@${x}`).join(' and ');
        validObj["userID"] = userID;
        validObj["charID"] = charID;
        console.log(validObj);
        try{
            const sql = `UPDATE Characters
                        SET
                            ${updates}
                        where
                            creator=@userID AND charID=@charID`;
            db.prepare(sql).run(validObj);
            return true;
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getCharInfo(charID){
        try{
            const sql = `SELECT * FROM Characters WHERE charID=@charID`;
            return db.prepare(sql).get({charID});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getChars(){
        try{
            const sql = `SELECT * FROM Characters`;
            const stmt = db.prepare(sql);
            return stmt.all();
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getCharsByUser(creator){
        try{
            const sql = `SELECT * FROM CHARACTERS where creator=@creator`;
            return db.prepare(sql).all({creator});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getAvatarHash(creator, charID){
        try{
            const sql = `SELECT charAvatar
                         FROM CHARACTERS
                         WHERE creator=@creator
                               AND
                               charID=@charaID
                        `
            return db.prepare(sql).get({creator, charID});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    uploadAvatar(creator, charID, charAvatar){
        try{
            const sql = `UPDATE Characters
                         SET charAvatar=@charAvatar
                         WHERE creator=@creator AND charID=@charID`;
            db.prepare(sql).run({creator, charID, charAvatar});
            return true;
        } catch(e){
            console.error(e);
            return false;
        }
    }
}

exports.characterModel = new CharacterModel(db);