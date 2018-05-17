const Discord = require('discord.js');
const moment = require('moment');

exports.run = async (client, message, args, func) => {
    
    var arrayofUsers = [];
    var arrayofBots = [];
    var amountOfBots = 0;
    let momentUTC = moment.utc().format("dddd, Do MMMM YYYY, HH:mm:ss") + " UTC";

    //Count Users, put into array
    for (Count in client.users.array()) {
        var User = client.users.array()[Count];
        await arrayofUsers.push(User);
    }

    await arrayofUsers.forEach(user => {
        if (user.bot == true) {
            amountOfBots += 1;
            arrayofBots.push(user.username);
        }
    })

    //Alphabeticise an array
    await func.alphaArrayInsensitive(arrayofBots);

    //Make an embed
    const embed = new Discord.RichEmbed()
                .setTitle("Users")
                .setDescription("Amount of Bot Users")
                .setColor(0xA3B6CF)

    //Find out if a user is a bot. If it is, add 1 to the counter, and add a field to the embed
    //Add a field with a title first, followed by the first bot username - probably Clyde
    await embed.addField("Bot Usernames", arrayofBots[0], true)
    
    //Trim the array by 1 (removing CLyde), then for each of the following items, add a field with the bot's username
    await arrayofBots.slice(1).forEach(element => {
            embed.addField("\u200b", element, true)
    })

    //Total # of bots & pull time/date
    await embed.addBlankField(false);
    await embed.addField("Total Bots", amountOfBots, false)
    await embed.setFooter(`Currently viewing bots in ${message.guild.name}`)
    await embed.setTimestamp()

    //Send the embed
    await message.channel.send(embed);

}