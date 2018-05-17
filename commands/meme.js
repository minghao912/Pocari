const Discord = require('discord.js');
const GoogleImages = require('google-images');
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('./Storage/tokens.json'));

//Start a new session of Google Images API
const gImgClient = new GoogleImages(tokens.GoogleCSE.CSEid, tokens.GoogleCSE.APIkey);

exports.run = (client, message, args, func) => {

    //Join the args to create a fluid search term (e.g. "Donald Duck")
    let k = args.join(' ');

    //If no specification for a keyword, just search for memes.
    let keyword;

    if (!args[0]) keyword = "memes";
    else {keyword = k + " memes";}
    
    //Generate Random Numbers for a Random Picture and Page
    let pageNum;
    let picNum;
    pageNum = func.randomNumGenInc(1, 15);

    //Log this so the user knows their meme is being generated, then delete it after 5 secs.
    if (!args[0]) message.channel.send(`Meme generation started! You have selected \`NO KEYWORD\`.`).then(msg => {msg.delete(5000)}).catch(console.error);
    else {message.channel.send(`Meme generation started! The keyowrd you have selected is \`${k}\`.`).then(msg => {msg.delete(5000)}).catch(console.error)};

    //Log to console
    console.log(`> Pocari is generating a meme with keyword: ${k}`);

    let selectedMeme;

    //Search google images
    gImgClient.search(keyword, {page: pageNum})
        .then(images => {

            picNum = func.randomNumGenInc(1, images.length);

            selectedMeme = images[picNum];

            //Define an array of file formats
            let fileFormats = ["png", "jpg", "jpeg", "gif"];

            if (!selectedMeme.url.endsWith("png") || !selectedMeme.url.endsWith("jpg") || !selectedMeme.url.endsWith("jpeg") || !selectedMeme.url.endsWith("gif"))  {
                message.channel.send("", {file: selectedMeme.url});
            } else {message.channel.send(selectedMeme.url)}

        })
        .catch(console.error)

}