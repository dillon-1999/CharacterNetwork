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
}
let c = new CharacterModel(db);
// c.createCharacter('af42e7f1-d7a9-4192-97f6-78e6980b404c', {name: 'bob', 
//                                eyeColor:'red', 
//                                hairColor:'red',
//                                skinColor: 'blue',
//                                feetTall: '5',
//                                inchesTall: '3',
//                                gender: 'Male',
//                                characterTraits: '123',
//                                backstory: "add backstory later" 
// })
// c.updateCharacter('af42e7f1-d7a9-4192-97f6-78e6980b404c','93ab6d1e-933c-4e47-a68d-c040624e2228', {chad: 'fred'});
// console.log(c.getChars());
exports.characterModel = new CharacterModel(db);