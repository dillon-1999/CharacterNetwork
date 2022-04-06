"use strict";
const argon2 = require("argon2");
const { userModel } = require("../Models/UserModel");
const { characterModel } = require("../Models/CharacterModel");
const { projectModel } = require("../Models/ProjectModel");
const {schemas, VALIDATION_OPTIONS} = require("../validators/validatorContainer");
 
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

module.exports = (app) =>{
    app.post('/search/results', async (req, res) => {
        console.log("GET /search/results");
        
        console.log(req.body)
        
        console.log("Line 17");
        console.log(req.body);
        const {search, searchType} = req.body;
        console.log("Line 20");
        console.log(search);
        console.log(searchType);
        if(!search || !searchType){
            return res.sendStatus(404);
        }
        
        let searchData;
        
        if(searchType == 'user') {
            searchData = userModel.getUserByName(search);
        }
        else if(searchType == 'char') {
            searchData = characterModel.getCharByName(search);
        }
        else if(searchType == 'project') {
            searchData = projectModel.getProjectByName(search);
        }
        else {
            return res.sendStatus(404);
        }
        
        console.log("Search Data");
        console.log(searchData);
        
        /*if(searchData) {
            try{
                res.render('searchResults', {session: req.session, searchData, searchType});
            } catch(e){
                console.error(e);
                return res.sendStatus(500);
            }
        } */
        
        if(searchData) {
            return res.sendStatus(200);
        }
        else {
            return res.sendStatus(400);
        }
    });
}
