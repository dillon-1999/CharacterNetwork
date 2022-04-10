"use strict";
const { userModel } = require("../Models/UserModel");
const { characterModel } = require("../Models/CharacterModel");
const { projectModel } = require("../Models/ProjectModel");

module.exports = (app) =>{
    app.post('/search/results', async (req, res) => {
        console.log("GET /search/results");
        const {search, searchType} = req.body;
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
    
        if(searchData) {
            if(searchData['public'] === 0){
                return res.sendStatus(404);
            }
            return res.status(200).json(searchData);
        }
        else {
            return res.sendStatus(400);
        }
    });
}
