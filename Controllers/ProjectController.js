"use strict";
// const argon2 = require("argon2");
const { projectModel } = require("../Models/ProjectModel");
const { starsInModel } = require("../Models/StarsInModel");

// const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.get('/projects/newProject', async (req, res) => {
        res.render('createProject');
    });

    // view page for an individual project
    // query param: projectID
    app.post('/projects/projectPage', async (req, res) => {
        const {projectID} = req.query;
        if(!projectID){
            return res.sendStatus(404);
        }

        const projectInfo = projectModel.getProjectInfoByID(projectID); 
        const projectsCharacters = starsInModel.getCharactersByProject(projectID);
        res.render('projectPage', {session: req.session, projectInfo, projectsCharacters});
    });

    // query param = userID
    app.post('/projects/allUserProjects', async (req, res) => {
        let {userID} = req.query;
        if(!userID || req.session.userID !== userID){
            return res.sendStatus(404);
        }
        const projects = projectModel.getUserProjects(userID);
        res.render('listProjectsPage', {session: req.session, userID, projects});
    });

    app.post('/projects/createProject', async (req, res) => {
        const {projectName, projectType, projectDescription, genre} = req.body;
        try {
            const added = projectModel.createProject(req.session.userID, 
                                                     projectName,
                                                     projectType,
                                                     projectDescription,
                                                     genre);
            added ? res.redirect('/users/homepage') : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
        
    });

    // render project page
    // query params: projectID
    app.get('/projects/project', async (req, res) => {
        
    });
}