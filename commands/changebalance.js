const Discord = require(`discord.js`);
const economy = require(`discord-eco`);

exports.run = (client, message, author, func, prefix) => {

    //Variables
    let cont = message.content.slice(1).split(" ");
    let args = cont.slice(1);

    //Defining a moderator role
    const modRole = 'Pocari Manager';

    //Check if user has the modRole
    if (!message.member.roles.find("name", modRole)) {
        message.channel.send('**Pocari sees that you little cheater! You need the secret role to use this command.**');
        return;
    }

    //Check if an amount is defined
    if (!args[0]) {
        message.channel.send(`**You need to define an amount. What's the point of Pocari adding nothing to your account? I have a life you know.\nCorrect usage: ${prefix}setbalance <amount> <user>**`);
        return;
    }

    //Make sure args[0] is a number
    if (isNaN(args[0])) {
        message.channel.send(`**This amount has to be a number. This isn't math class\nCorrect Usage: ${prefix}setbalance <amount> <user>**`);
        return;
    }

    //Check if a user is defined
    let definedUser = '';
    if (!args[1]) {
        message.channel.send(`**You need to define a user. Who am I supposed to give money to? God? He already has enough money.\nCorrect usage: ${prefix}setbalance <amount> <user>**`);
        return;
    } else {
        let firstMentioned = message.mentions.users.first();
        definedUser = firstMentioned.id;
        mentionedUser = firstMentioned.username;
        avatarUser = firstMentioned;
    }

    //Run (If guild-unique method is used, make sure guild ID is added to the end of 'definedUser')
    if (args[0] == 0) {
        message.channel.send(`**You need to define an amount. What's the point of Pocari adding nothing to your account? I have a life you know.\nCorrect usage: ${prefix}setbalance <amount> <user>**`);
        return;
    } else if (message.author.id !== "342819448111235092" && args[0] > 10000) {
        message.channel.send(`**You little cheater! You can't just change your own balance! Pocari can see what you\'re doing, you know!**`);
        return;
    } else if (args[0] > 0) {
        economy.updateBalance(definedUser, parseInt(args[0])).then((i) => {
            message.channel.send(`**User <@${definedUser}> has had ${args[0]}/- added to their account.**`);

            //Create an embed showing transaction information
            const embed = new Discord.RichEmbed()
                .setDescription('**Transaction Information**')
                .setColor(0xD4AF37)
                .addField('Starting Balance', (i.money * 1) - args[0] + "/-", true)
                .addField('Amount Added', args[0] + "/-", true)
                .addField('New Balance', i.money + "/-", false)
                .setFooter('ka-ching!')
        
            message.channel.send({embed});
            console.log(`> ${message.author.username} has added ${args[0]}/- to ${mentionedUser}\'s account.`);

        });

    } else if (args[0] < 0) {

        let amountSubtracted = args[0].slice(1);
        economy.updateBalance(definedUser, parseInt(args[0])).then((i) => {
            message.channel.send(`**User <@${definedUser}> has had ${amountSubtracted}/- subtracted from their account.**`);

            //Create an embed showing transaction information
            const embed = new Discord.RichEmbed()
                .setDescription('**Transaction Information**')
                .setColor(0xD4AF37)
                .setThumbnail(avatarUser.avatarURL)
                .addField('Starting Balance', (i.money * 1) - args[0] + "/-", true)
                .addField('Amount Subtracted', args[0] + "/-", true)
                .addField('New Balance', i.money + "/-", false)
                .setFooter('ka-ching!')
    
            message.channel.send({embed});

            console.log(`> ${message.author.username} has subtracted ${amountSubtracted}/- from ${mentionedUser}\'s account.`);
        
        });


    }

}