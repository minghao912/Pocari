const Discord = require(`discord.js`);
const economy = require(`discord-eco`);

exports.run = (client, message, author, args, func) => {

    //Define whose balance to retreive
    let user = message.mentions.users.first() || message.author;
    
    economy.fetchBalance(user.id).then((i) => {   //economy.fetchBalance takes the userID and puts the data with it into 'i'

        //Variables
        let pocariBalanceFooter = ''
        if (i.money <= 1000) {

            pocariBalanceFooter = 'Time to get on that grind, boi!';

        } else if (i.money > 1000 && i.money <= 2000) {

            pocariBalanceFooter = 'That money sure is buildin\' up!';

        } else if (i.money > 2000) {

            pocariBalanceFooter = 'Someone\'s rollin in dough!';

        }
        
        //Embed
        const embed = new Discord.RichEmbed()
            .setDescription(`**${message.guild.name} Bank**`)
            .setColor(0xD4AF37)
            .setThumbnail(message.author.avatarURL)
            .addField('Account Holder', user.username, true)
            .addField('Account Balance', i.money + "/-", true)
            .setFooter(pocariBalanceFooter)
        
        //Send Embed
        message.channel.send({embed});
        console.log(`> ${message.author.username} checked ${user.username}\'s balance. They have ${i.money}/- in their account.`);

    })

}