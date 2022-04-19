"use strict";
// const argon2 = require("argon2");
const { projectModel } = require("../Models/ProjectModel");
const { starsInModel } = require("../Models/StarsInModel");
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

    // query param = userID
    // /projects/allUserProjects?viewer=<%= session.userID %>&owner=<%= userInfo.userID %>

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
            if(visibility === '1'){
                changeVisibility = projectModel.setPublic(req.session.userID, projectID);
            } else if(visibility === '0'){
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

    app.post('/projects/editProjectPage', async (req, res) => {
        const {projectID} = req.query;
        const checkProjectOwner = projectModel.checkProjectOwner(projectID, req.session.userID);
        if(!checkProjectOwner || !req.session.isLoggedIn){
            console.log('not owner')
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
            console.log('not owner')
            return res.sendStatus(404);
        }
        const updates = req.body;
        console.log(updates);
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