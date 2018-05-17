const Discord = require('discord.js');
const moment = require('moment');

exports.run = (client, message, args, func) => {

    //Check if the defined arguments are valid
    if (!args[0]) {
        return message.channel.send(`You need to define a user! Who am I supposed to message? Correct Format: @username#xxxx`);
    }

    if (!message.content.includes("@")) {
        return message.channel.send(`You need to define a user! Who am I supposed to message? Correct Format: @username#xxxx`);
    }

    if (!args[1]) {
        return message.channel.send(`You need to specify something to send! There's no point in sending nothing!`);
    } 

    //Set variables for elements of the DM
    let dmUser = message.mentions.users.first();

    args.shift();
    let dmMsg = args.join(' ');

    //Get the current date and time (UTC)
    let momentUTC = moment.utc().format("dddd, Do MMMM YYYY, HH:mm:ss") + " UTC";

    //Create a fancy embed for the DM
    const embed = new Discord.RichEmbed()
        .setTitle(`Pocari Message Delivery System`)
        .setDescription(`*Message from @${message.author.username}*`)
        .setColor(0xb3ccff)
        .addField(`\u200b`, dmMsg, false)
        .setFooter(`Message sent ${momentUTC}`)

    //Send the DM
    dmUser.send(`You have mail! @${message.author.username} sent Pocari to deliver a message.`)
        .then(dmUser.send(embed))
        .then(console.log(`> ${message.author.username} has used the Pocari Message Delivery System to send a DM: "${dmMsg}" to ${dmUser.username}.`))
        .catch(console.error);

    //Confirm DM sent to channel
    message.channel.send(`DM successfully sent to ${dmUser}`);

}