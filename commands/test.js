const Fortnite = require('fortnite');
const stats = new Fortnite('947ac123-30b2-46cd-ad91-3a7cf59ccfa1');
const moment = require('moment');
const Discord = require('discord.js');
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('./Storage/tokens.json'));
const GoogleImages = require('google-images');
const gImgClient = new GoogleImages(tokens.GoogleCSE.CSEid, tokens.GoogleCSE.APIkey);

exports.run = async (client, message, author, args, prefix, func, tokens) => {

     
    
}