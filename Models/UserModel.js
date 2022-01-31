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

    setBio(bio, userID) {
        try {
            const sql = `UPDATE
                         SET
                            bio=@bio
                        where 
                            userID=@userID`
            db.prepare(sql).run({bio, userID});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    changeEmailAddress (newEmailAddr, userID) {
        try{
            const sql = `
                UPDATE Users
                SET
                    email=@newEmailAddr
                WHERE
                    userID=@userID
            `;
            db.prepare(sql).run({newEmailAddr, userID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    changeUsername (newUsername, userID) {
        try{
            const sql = `
                UPDATE Users
                SET
                    username=@newUsername
                WHERE
                    userID=@userID
            `;
            db.prepare(sql).run({newUsername, userID});
            return true;
        } catch (e){
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

    emailVerified (userID) {
        try{
            const sql = `
                UPDATE Users
                SET
                    didVerifyEmail=1
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

    updatePassword(userID, passwordHash){
        try {
            const sql = `
                UPDATE Users
                SET
                    passwordHash=@passwordHash
                WHERE
                    userID=@userID
            `;
            db.prepare(sql).run({userID,  passwordHash});
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
            const sql = `SELECT userID, username, role, email, didVerifyEmail, bio
                         FROM Users 
                         WHERE userID = @userID
            `;
            return db.prepare(sql).get({userID});
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
}

exports.userModel = new UserModel(db);