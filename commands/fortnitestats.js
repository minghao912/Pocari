const Fortnite = require('fortnite');
const stats = new Fortnite('947ac123-30b2-46cd-ad91-3a7cf59ccfa1');    //This is API key
const Discord = require('discord.js');

exports.run = (client, message, args, tools) => {

    //Have two variables needed for input
    let prefix = '>';
    let platform;
    let username;

    //Only 3 platform options: pc, xbl, psn. Make sure they're typing one of these.

    //Args contains the message contents, first item in array to be platform
    if (!['pc','xbl','psn'].includes(args[0])) return message.channel.send(`**Please include the platform: \`${prefix}fortnitestats [ pc | xbl | psn ] <username>\`**`);

    //Also need username, so on args
    if (!args[1]) return message.channel.send(`**Please include the username: \`${prefix}fortnitestats <platform> <username>\`**`);

    //Assign Values
    platform = args.shift();    //Shift the first item in the args array into platform
    username = args.join(' ');  //Now we can combine args to form the username

    //Fetch Data
    message.channel.send(`Pocari is retreiving statistics for ${username} on ${platform}...`);
    console.log(`> ${message.author.username} has requested Fortnite statistics for the user ${username} on the platform ${platform}.`);
    stats.getInfo(`${username}`, `${platform}`).then(data => {   //'Data' will now hold the response. Full JSON tree found online.

        //Now output an embed
        const embed = new Discord.RichEmbed()
            .setColor(0x800080)
            .setTitle(`Fortninte Statistics`)
            .setDescription(`Stats for @${data.username}`) 
            .setThumbnail('http://pocari.tk/fortnite_weapon_icons/SsS1VPUM.jpg')
            .addField('\u200b', '\u200b', false)
            .addField('**Top Placements**', '\u200b', false)
            .addField('Top 3s (Solo)', data.lifetimeStats[0].value, true)
            .addField('Top 5s (Duo)', data.lifetimeStats[1].value, true)
            .addField('Top 6s (Squad)', data.lifetimeStats[3].value, true)
            .addField('Top 12s (Squad)', data.lifetimeStats[4].value, true)
            .addField('Top 25s (Solo)', data.lifetimeStats[5].value, true)
            .addField('\u200b', '\u200b', false)
            .addField('**Total Statistics**', '\u200b', false)
            .addField('Score', data.lifetimeStats[6].value, true)
            .addField('Matches Played', data.lifetimeStats[7].value, true)
            .addField('Wins', data.lifetimeStats[8].value, true)
            .addField('Win Percentage', data.lifetimeStats[9].value, true)
            .addField('Kills', data.lifetimeStats[10].value, true)
            .addField('Kill/Death Ratio', data.lifetimeStats[11].value, true)
            .addField('Kills per Minute', data.lifetimeStats[12].value, true)
            .addField('Time Played', data.lifetimeStats[13].value, true)
            .addField('Average Survival Time', data.lifetimeStats[14].value, true)

        message.channel.send({embed});

    })

    .catch(error => {   //Error will return if username not found

        message.channel.send(`${error}`);

    })

}