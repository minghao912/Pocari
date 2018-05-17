const Discord = require('discord.js');

exports.run = (client, message, args) => {

    //Grab the user, if they're doing it for themselves or mentioning someone
    let user = message.mentions.users.first() || message.author;    //Checks if there's a mention, and takes the first one. If no mention, takes message author

    //Verify the specified user is listening to spotify
    if (user.presence.activity !== null && user.presence.activity.type === 'LISTENING' && user.presence.activity.name === 'Spotify' && user.presence.activity.assets !== null) {

        //Variables
        let trackIMG = `https://i.scdn.co/image/${user.presence.activity.assets.largeImage.slice(8)}`;  //Fetches URL image using largeImage asset (slices off first 8 chars)
        let trackURl = `https://open.spotify.com/track/${user.presence.activity.syncID}`;   //Grabs the syncID and adds it to the end of a spotify URL
        let trackName = user.presence.activity.details;
        let trackAuthor = user.presence.activity.state;
        let trackAlbum = user.presence.activity.assets.largeText;   //These hold song info. Taken from user's presence.

        //Creat embed object
        const embed = new Discord.MessageEmbed()
            .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')    //Sets author and Icon field
            .setColor(0x1ED760)
            .setThumbnail(trackIMG)
            .addField('Song Name', trackName, true)
            .addField('Album', trackAlbum, true)
            .addField('Author', trackAuthor, false)
            .addField('Listen to Track:', `[\`${trackURL}\`](trackURL)`, false) //This sets a clickable link to the trackURL. Still shows trackURL

        //Send embed
        message.channel.send(embed);

    } else {
       
        message.channel.send('**This user isn\'t listening to Spotify! How\'s Pocari supposed to work with that?');

    }

}