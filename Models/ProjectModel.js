"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class ProjectModel {
    constructor(db){
        this.db = db;
    }

    createProject(userID, projectName, projectType, genre){
        try {
            const sql = `INSERT INTO Projects (projectID, userID, projectName, projectType, genre)
                         VALUES (@projectID, @userID, @projectName, @projectType, @genre)`;
            const projectID = uuidV4();
            db.prepare(sql).run({projectID, userID, projectName, projectType, genre});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    deleteProject(userID, projectID){
        try {
            const sql = `DELETE FROM Projects
                         WHERE projectID=@projectID
                         AND
                         userID=@userID`;
            db.prepare(sql).run({userID, projectID});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    changeProjectName(userID, projectID, projectName){
        try {
            const sql = `UPDATE Projects
                         SET projectName=@projectName
                         WHERE userID=@userID AND projectID=@projectID`;
            db.prepare(sql).run({userID, projectID, projectName});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    changeProjectType(userID, projectID, projectType){
        try {
            const sql = `UPDATE Projects
                         SET projectType=@projectType
                         WHERE userID=@userID AND projectID=@projectID`;
            db.prepare(sql).run({userID, projectID, projectType});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    getUsersProjects(userID){
        try {
            const sql = `SELECT * FROM Projects WHERE userID=@userID`;
            return db.prepare(sql).all({userID});
        } catch (e){
            console.error(e);
            return false;
        }
    }

    getProjectsByGenre(genre){
        try {
            const sql = `SELECT * FROM Projects WHERE genre=@genre`;
            return db.prepare(sql).all({genre});
        } catch (e){
            console.error(e);
            return false;
        }
    }

    getProjectsByType(projectType){
        try {
            const sql = `SELECT * FROM Projects WHERE projectType=@projectType`;
            return db.prepare(sql).all({projectType});
        } catch (e){
            console.error(e);
            return false;
        }
    }

    setPublic(userID, projectID){
        try {
            const sql = `UPDATE Projects
                         SET public=1
                         WHERE userID=@userID AND projectID=@projectID`;
            db.prepare(sql).run({userID, projectID, genre});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    setPrivate(userID, projectID){
        try {
            const sql = `UPDATE Projects
                         SET public=0
                         WHERE userID=@userID AND projectID=@projectID`;
            db.prepare(sql).run({userID, projectID, genre});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }
}

exports.projectModel = new ProjectModel(db);