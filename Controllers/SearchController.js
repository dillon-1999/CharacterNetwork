"use strict";
const { userModel } = require("../Models/UserModel");
const { characterModel } = require("../Models/CharacterModel");
const { projectModel } = require("../Models/ProjectModel");

module.exports = (app) =>{
    app.post('/search/results', async (req, res) => {
        console.log("GET /search/results");
        const {search, searchType} = req.body;
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
            // to view public you must be an admin
            if(searchData['public'] === 0 && req.session.role !== 1){
                return res.sendStatus(404);
            }
            return res.status(200).json(searchData);
        }
        else {
            return res.sendStatus(400);
        }
    });
}
