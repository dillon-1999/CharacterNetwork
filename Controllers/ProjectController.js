"use strict";
// const argon2 = require("argon2");
const { projectModel } = require("../Models/ProjectModel");
const { starsInModel } = require("../Models/StarsInModel");
const { characterModel } = require("../Models/CharacterModel");
const url = require('url');
// const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

module.exports = (app) =>{
    app.get('/projects/newProject', async (req, res) => {
        res.render('createProject', {session: req.session});
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

    // changing this a bit:
    // if it is the owner, it shows all projects
    // if it is just a viewer, it shows public projects
    app.post('/projects/allUserProjects', async (req, res) => {
        let {owner} = req.query;
        if(!owner || !req.session.isLoggedIn){
            return res.sendStatus(404);
        }

        let projects;
        if(owner === req.session.userID){
            projects = projectModel.getUserProjects(owner);
        } else{
            projects = projectModel.getUserPublicProjects(owner);
        }
        res.render('listProjectsPage', {session: req.session, owner, projects});
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
            return res.sendStatus(404);
        }
        const checkProjectOwner = projectModel.checkProjectOwner(projectID, req.session.userID);
        if(!checkProjectOwner){
            return res.sendStatus(404);
        }

        const projectCharacters = starsInModel.getCharactersByProject(projectID);
        try{
            let changeVisibility;
            if(visibility === '1'){
                changeVisibility = projectModel.setPublic(req.session.userID, projectID);
                for(let i = 0; i < projectCharacters.length; ++i){
                    characterModel.setPublic(req.session.userID, projectCharacters[i].charID);
                }
            } else if(visibility === '0'){
                changeVisibility = projectModel.setPrivate(req.session.userID, projectID);
                // must set all characters private
                for(let i = 0; i < projectCharacters.length; ++i){
                    characterModel.setPrivate(req.session.userID, projectCharacters[i].charID);
                }
            } else{
                return res.sendStatus(404);
            }
            
            changeVisibility ? res.redirect(307, '/projects/allUserProjects?owner=' + req.session.userID) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }

    });

    app.post('/projects/editProjectPage', async (req, res) => {
        const {projectID} = req.query;
        const checkProjectOwner = projectModel.checkProjectOwner(projectID, req.session.userID);
        if(!checkProjectOwner || !req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        const info = projectModel.getProjectInfoByID(projectID);
        if(!info){
            return res.sendStatus(404);
        }

        res.render('editProjectPage', {session: req.session, project: info});
    });

    app.post('/projects/updateProject', async (req, res) => {
        console.log("/projects/updateProject")
        const {projectID} = req.query;
        const checkProjectOwner = projectModel.checkProjectOwner(projectID, req.session.userID);
        if(!checkProjectOwner || !req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        const updates = req.body;
        try{
            const didUpdate = projectModel.updateProject(req.session.userID, projectID, updates);
            didUpdate ? res.sendStatus(200) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });

    app.get('/admin/allProjects', async (req, res) =>{
        let projects = []
        if(req.session.isLoggedIn && req.session.role == 1){
            projects = projectModel.getAllProjects();
        }
        res.render('adminAllProjects', {session: req.session, projects})
    });
}

// http://localhost:8006/projects/projectPage?projectID=e6b62489-3a2d-4ca8-a519-ee7b52c1f86b