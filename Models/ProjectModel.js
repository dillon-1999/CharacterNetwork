"use strict";
const { db } = require("./db");
const uuidV4 = require("uuid").v4;

class ProjectModel {
    constructor(db){
        this.db = db;
    }

    createProject(userID, projectName, projectType, projectDescription, genre,){
        try {
            const sql = `INSERT INTO Projects (projectID, userID, projectName, projectType,projectDescription, genre)
                         VALUES (@projectID, @userID, @projectName, @projectType, @projectDescription, @genre)`;
            const projectID = uuidV4();
            db.prepare(sql).run({projectID, userID, projectName, projectType,projectDescription, genre});
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    // deletes all characters along with a project deletion
    deleteProjectTransaction(userID, projectID){
        try {
            const data = {userID, projectID};
            const sql_statements = [
                'DELETE FROM Characters WHERE charID IN (SELECT * FROM StarsIn WHERE projectID=@projectID)',
                'DELETE FROM Projects WHERE projectID=@projectID AND userID=@userID'
            ].map(stmt => db.prepare(stmt));
            const trans = db.transaction( (data) => {
                for (const i of sql_statements){
                    i.run(data)
                }
            });
            trans(data);
            return true;
        } catch (e){
            console.error(e);
            return false;
        }
    }

    deleteProject(userID, projectID){
        try {
            const sql = 'DELETE FROM Projects WHERE userID=@userID AND projectID=@projectID';
            db.prepare(sql).run({projectID, userID});
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

    changeProjectDescription(userID, projectID, projectDescription){
        try {
            const sql = `UPDATE Projects
                         SET projectDescription=@projectDescription
                         WHERE userID=@userID AND projectID=@projectID`;
            db.prepare(sql).run({userID, projectID, projectDescription});
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

    getUserProjects(userID){
        try {
            const sql = `SELECT * FROM Projects WHERE userID=@userID`;
            return db.prepare(sql).all({userID});
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

    // getProjectNameByID(projectID){
    //     try {
    //         const sql = `SELECT projectName FROM Projects WHERE projectID=@projectID`;
    //         return db.prepare(sql).get({projectID});
    //     } catch (e){
    //         console.error(e);
    //         return false;
    //     }
    // }

    getProjectInfoByID(projectID){
        try {
            const sql = `SELECT * FROM Projects WHERE projectID=@projectID`;
            return db.prepare(sql).get({projectID});
        } catch (e){
            console.error(e);
            return false;
        }
    }
}

exports.projectModel = new ProjectModel(db); 