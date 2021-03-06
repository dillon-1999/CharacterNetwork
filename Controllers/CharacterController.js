"use strict";

const { characterModel } = require("../Models/CharacterModel");
const { starsInModel } = require("../Models/StarsInModel");
const { projectModel } = require("../Models/ProjectModel");
const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");

const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/../public/charAvatars/'));
        
    },

    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(12).toString('hex');
        const [extension] = file.originalname.split(".").slice(-1);
        cb(null, `${randomName}.${extension}`);
    },

    fileFilter: (req, file, cb) => {
        if(!req.session){
            return cb(null, false);
        }
        const [extension] = file.originalname.split(".").slice(-1);
        if(extension != 'jpg'){
            return cb(null, false)
        } else {
            cb(null, true);
        }
    }
});

let upload = multer({storage});

module.exports = (app) => {
    app.get('/characters/newCharacter', async (req, res) => {
        const projects = projectModel.getUsersProjects(req.session.userID);
        res.render('createCharacterPage', {session: req.session, projects});
    });

    app.post('/characters/uploadAvatarPage', async (req, res) => {
        console.log("GET /users/uploadAvatarPage")
        const {charID} = req.query;
        const checkCharacterOwner = characterModel.checkCharacterOwner(charID, req.session.userID);
        if(!req.session.isLoggedIn || !checkCharacterOwner){
            return res.sendStatus(404);
        }

        res.render('uploadCharAvatar', {session: req.session, charID: charID});
    });

    app.post('/characters/createCharacter', async (req, res) => {
        const character = req.body;
        const {value, error} = schemas.characterSchema.validate(req.body, VALIDATION_OPTIONS); 
        if (error){
            const errorMessages = error.details.map(error => error.message);
            return res.status(400).json(errorMessages);
        }

        try {
            const added = characterModel.createCharacter(req.session.userID, character);
            if(character.project){ // if user wanted to add to a project
                starsInModel.addStar(character.project, added.charID);
            }
            added ? res.redirect('/users/homepage?userID=' + req.session.userID) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
        
    });

    // query params: charID
    app.post('/characters/uploadImage/', upload.single('file'), (req,res) => {
        if(!req.session.userID || !req.query.charID){
            return res.sendStatus(404);
        }
        try{
            const previousFile = characterModel.getAvatarHash(req.session.userID, req.query.charID);
            const didUpload = characterModel.uploadAvatar(req.session.userID, req.query.charID, req.file.filename);
            if(didUpload){
                if(previousFile){ // this deletes the old file 
                    fs.unlinkSync(`../characterAvatars/${previousFile.charAvatar}`);
                }
                return res.sendStatus(200);
            } else {
                return res.sendStatus(400);
            }

        } catch(e){
            res.send(e);
        }
    });

    // queryParam: charID
    app.get('/characters/charPage/:charID', async (req, res) => {
        const charID = req.params.charID;
        if(!charID){
            return res.sendStatus(404);
        }
        const charData = characterModel.getCharInfo(charID);
        const charProjectID = starsInModel.getProjectByChar(charID);

        let projectName = "";
        if(charProjectID){
            projectName = projectModel.getProjectInfoByID(charProjectID.projectID).projectName;
        }
        
        try{
            res.render('characterPage', {session: req.session, charData, projectName: projectName});
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });
    
    
    
    app.post('/characters/changeVisibility', async (req,res) => {
        const {visibility, charID} = req.query;
        if(!req.session.userID){
            return res.sendStatus(404);
        }
        const checkCharacterOwner = characterModel.checkCharacterOwner(charID, req.session.userID);
        if(!checkCharacterOwner){
            return res.sendStatus(404);
        }

        try{
            let changeVisibility;
            if(visibility === '0'){
                changeVisibility = characterModel.setPrivate(req.session.userID, charID);
            } else if(visibility === '1'){
                changeVisibility = characterModel.setPublic(req.session.userID, charID);
            } else{
                return res.sendStatus(404);
            }
            
            changeVisibility ? res.redirect('../users/homepage?userID=' + req.session.userID) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });

    app.post('/characters/editCharInfo', async (req, res) => {
        const {charID} = req.query;
        const checkCharacterOwner = characterModel.checkCharacterOwner(charID, req.session.userID);
        if(!checkCharacterOwner || !req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        const projects = projectModel.getUsersProjects(req.session.userID);
        const charInfo = characterModel.getCharInfo(charID);
        res.render('editCharacterPage', {session: req.session, projects, charID: charID, charInfo});
    });

    app.post('/characters/updateCharacter', async (req, res) => {
        const {charID} = req.query;
        const checkCharacterOwner = characterModel.checkCharacterOwner(charID, req.session.userID);
        if(!checkCharacterOwner || !req.session.isLoggedIn){
            return res.sendStatus(404);
        }
        const updates = req.body;
        try{
            const didUpdate = characterModel.updateCharacter(req.session.userID, charID, updates);
            if(updates.project){ // if user wanted to add to a project
                starsInModel.addStar(updates.project, charID);
            }
            didUpdate ? res.sendStatus(200) : res.sendStatus(500);
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }

    });

    app.get('/admin/allCharacters', async (req, res) =>{
        let chars = []
        if(req.session.isLoggedIn && req.session.role == 1){
            chars = characterModel.getChars();
        }
        res.render('adminAllCharacters', {session: req.session, chars})
    });
}