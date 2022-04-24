"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class UserModel {
    constructor (db){
        this.db = db;
    }

    createUser(user) {
        try {
            const sql = `INSERT INTO Users (userID, username, passwordHash, email)
                         VALUES (@userID, @username, @passwordHash, @email)`;
            user.userID = uuidV4();
            db.prepare(sql).run(user);
            return true;
        } catch (e) { 
            console.error(e);
            return false;
        }
    }

    updateUser(userID, updatesObj){
        let options = ['username', 'avatarAddress', 'passwordHash',
                       'email', 'bio', 'role', 'emailVerified'];
        let validObj = {};
        for(const i in updatesObj){
            if(options.includes(i) && updatesObj[i]){
                validObj[i] = updatesObj[i];
            }
        }
        if(Object.keys(validObj).length === 0){
            return false;
        }
        let updates = Object.keys(validObj).map(x => x + `=@${x}`).join(' , ');
        validObj["userID"] = userID;
        try{
            const sql = `UPDATE Users
                        SET
                            ${updates}
                        where
                            userID=@userID`;
            db.prepare(sql).run(validObj);
            return true;
        } catch(e){
            console.error(e);
            return false;
        }
    }

    upgradeToAdmin (userID) {
        try{
            const sql = `
                UPDATE Users
                SET
                    role=1
                WHERE
                    userID=@userID
            `;
            db.prepare(sql).run({userID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    revokeAdmin (userID) {
        try{
            const sql = `
                UPDATE Users
                SET
                    role=0
                WHERE
                    userID=@userID
            `;
            db.prepare(sql).run({userID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    deleteUser (userID) {
        try{
            const sql = `DELETE FROM Users WHERE userID=@userID`;
            db.prepare(sql).run({userID});
            return true;
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getPasswordHash (email) {
        try{
            const sql = `SELECT passwordHash FROM Users WHERE email=@email`;
            return db.prepare(sql).get({email});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getUserData (userID) {
        try{
            const sql = `SELECT userID, username, role, bio, avatarAddress, dateCreated
                         FROM Users 
                         WHERE userID = @userID
            `;
            return db.prepare(sql).get({userID});
        } catch(e) {
            console.error(e);
            return false;
        }
    }
    
    getUserByName (name) {
        try{
            const sql = `SELECT userID, username
                         FROM Users 
                         WHERE username = @name
            `;
            return db.prepare(sql).get({name});
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    getUserNameByID (userID) {
        try {
            const sql = `SELECT username
                         FROM Users
                         Where userID = @userID
            `;
            return db.prepare(sql).get({userID});
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getUserDataByEmail(email){
        try {
            const sql = `
                SELECT
                    userID, username, role
                FROM
                    Users
                WHERE
                    email=@email
            `;
            return db.prepare(sql).get({email});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    getUsers(){
        try{
            const sql = `
                SELECT *
                FROM Users
            `;
            const stmt = db.prepare(sql);
            return stmt.all();
        } catch(err) {
            console.error(err);
            return false;
        }
    }

    getAvatarHash(userID){
        try{
            const sql = `SELECT avatarAddress
                         FROM Users
                         WHERE userID=@userID
                        `;
            return db.prepare(sql).get({userID});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    isUser(userID){
        try{
            const sql = "Select username from Users where userID=@userID";
            return db.prepare(sql).get({userID});
        } catch(e){
            console.error(e);
            return false;
        }
    }

    uploadAvatar(userID, avatarAddress){
        try{
            const sql = `UPDATE Users
                         SET avatarAddress=@avatarAddress
                         WHERE userID=@userID`;
            db.prepare(sql).run({userID, avatarAddress});
            return true;
        } catch(e){
            console.error(e);
            return false; 
        }
    }
}

exports.userModel = new UserModel(db);