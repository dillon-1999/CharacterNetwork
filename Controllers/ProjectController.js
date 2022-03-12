"use strict";
// const argon2 = require("argon2");
const { projectModel } = require("../Models/ProjectModel");
// const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.get('/projects/newProject', async (req, res) => {
        res.render('createProject');
    });

    app.post('/projects/createProject', async (req, res) => {
        const {projectName, projectType, projectDescription, genre} = req.body;
        try {
            const added = projectModel.createProject(req.session.userID, 
                                                     projectName,
                                                     projectType,
                                                     projectDescription,
                                                     genre)
            added ? res.redirect('/users/homepage') : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
        
    });
}