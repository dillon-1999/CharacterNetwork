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
            return character;
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
        
        if(updatesObj.feetTall){
            if(!parseInt(updatesObj.feetTall)){
                delete updatesObj.feetTall;
            }
        }
        if(updatesObj.inchesTall){
            if(!parseInt(updatesObj.inchesTall)){
                delete updatesObj.feetTall;
            }
        }
        console.log(updatesObj);
        let validObj = {};
        for(const i in updatesObj){
            if(options.includes(i) && updatesObj[i].trim()){
                validObj[i] = updatesObj[i];
            }
        }
        
        if(Object.keys(validObj).length === 0){
            return false;
        }
        let updates = Object.keys(validObj).map(x => x + `=@${x}`).join(' , ');
        validObj["userID"] = userID;
        validObj["charID"] = charID;

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
    
    getCharByName(name){
        try{
            const sql = `SELECT * FROM Characters WHERE name = @name `;
            return db.prepare(sql).get({name});
            
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
            const sql = `SELECT *
                        FROM CHARACTERS
                        WHERE creator=@creator
                        ORDER BY public DESC, name`;
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
                               charID=@charID
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
    
    checkCharacterOwner(charID, userID){
        try{
            const sql = `select * from Characters where charID=@charID and creator=@userID`;
            return db.prepare(sql).get({charID, userID});
        }catch(e){
            console.error(e);
            return false;
        }
    }
    
    setPublic(userID, charID){
        try {
            const sql = `UPDATE Characters
                         SET public=1
                         WHERE creator=@userID AND charID=@charID`;
            db.prepare(sql).run({userID, charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    setPrivate(userID, charID){
        try {
            const sql = `UPDATE Characters
                         SET public=0
                         WHERE creator=@userID AND charID=@charID`;
            db.prepare(sql).run({userID, charID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }
}

exports.characterModel = new CharacterModel(db);