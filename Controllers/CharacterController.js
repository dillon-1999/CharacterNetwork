"use strict";

const { characterModel } = require("../Models/CharacterModel");
const { starsInModel } = require("../Models/StarsInModel");
const { projectModel } = require("../Models/ProjectModel");

const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../characterAvatars');
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

    app.post('/characters/createCharacter', async (req, res) => {
        const character = req.body;
        console.log(req.body);
        try {
            const added = characterModel.createCharacter(req.session.userID, character);
            if(character.project){ // if user wanted to add to a project
                starsInModel.addStar(character.project, added.charID);
            }
            added ? res.redirect('/users/homepage') : res.sendStatus(500);
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
    app.get('/characters/charPage', async (req, res) => {
        const charID = req.query.charID;
        if(!charID){
            return res.sendStatus(404);
        }
        const charData = characterModel.getCharInfo(charID);
        const charProjectID = starsInModel.getProjectByChar(charID);
        const projectName = (charProjectID) ? projectModel.getProjectInfoByID(charProjectID).projectName : "";
        try{
            res.render('characterPage', {session: req.session, charData, projectName: projectName});
        } catch(e){
            console.error(e);
            return res.sendStatus(500);
        }
    });
}