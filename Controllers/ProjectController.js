"use strict";
// const argon2 = require("argon2");
const { projectModel } = require("../Models/ProjectModel");
const { starsInModel } = require("../Models/StarsInModel");
const url = require('url');
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
            added ? res.redirect(307, '/users/homepage?userID=' + req.session.userID) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
        
    });

    app.post('/projects/changeVisibility', async (req,res) => {
        const {visibility, projectID} = req.query;
        if(!req.session.userID){
            console.log('not logged in')
            return res.sendStatus(404);
        }
        const checkProjectOwner = projectModel.checkProjectOwner(projectID, req.session.userID);
        if(!checkProjectOwner){
            console.log('not owner')
            return res.sendStatus(404);
        }

        try{
            let changeVisibility;
            if(visibility === '0'){
                changeVisibility = projectModel.setPublic(req.session.userID, projectID);
            } else if(visibility === '1'){
                changeVisibility = projectModel.setPrivate(req.session.userID, projectID);
            } else{
                console.log('in try')
                return res.sendStatus(404);
            }
            changeVisibility ? res.redirect(307, '/projects/allUserProjects?userID=' + req.session.userID) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });
}

// http://localhost:8006/projects/projectPage?projectID=e6b62489-3a2d-4ca8-a519-ee7b52c1f86b