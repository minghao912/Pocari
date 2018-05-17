const Discord = require('discord.js');
const economy = require('discord-eco');
const fs = require('fs');
const tokenJSON = fs.readFileSync('./Storage/tokens.json', 'utf8')
const tokens = JSON.parse(tokenJSON);

exports.run = (client, message, author, func) => {

    //Define Variable
    let args = message.content.slice(tokens.prefix.length).trim().split(" ").slice(1);

    //Check message arguments
    if (!args[0]) {
        const embed = new Discord.RichEmbed()
            .setTitle('**Pocari Roll Rules**')
            .setDescription('*Pocari will roll a 1000-sided dice.*')
            .setColor(0xD4AF37)
            .addField("If the number is...", "You will get a payout of...", false)
            .addBlankField()
            .addField("000-500", "0x", true)
            .addField("500-900", "1x", true)
            .addField("900-990", "2x", true)
            .addField("990-998", "Grand Prize - 5x", true)
            .addField("998-1000", "Jackpot! - 10x", true)
            .addBlankField()
            .addField("Correct Usage", `\`${tokens.prefix}roll <amount>\``, false)

        return message.channel.send(embed);
    }
    if (args[0] <= 0) {
        return message.channel.send(`**Please enter a wager greater than zero (0).**`);
    }
    if (isNaN(args[0])) {
        return message.channel.send(`**This ammount has to be a number. This isn't math class!\nCorrect Usage: ${tokens.prefix}transfer <amount> <user>**`);
    }

    //Check if user has money
    economy.fetchBalance(message.author.id).then((i) => {
        
        if (args[0] > i.money) {    //If user no have money, why bet?

            let defecit = args[0] - i.money;
            return message.channel.send(`**You don't have enough money to make this transaction. LOOOOOSER!\nRequired Amount: ${args[0]}/-\nCurrent Balance: ${i.money}/-\nDefecit: ${defecit}**`);
        
        }
        else {
            
            //Status message
            message.channel.send(`Pocari is rolling the dice...`);

            //Vars
            let number;
                number = func.randomNumGenExc(1, 1000);

            let bet;
                bet = parseInt(args[0]);

            let prize;
            let payout = 0;
            let footer;
            let won = "";
            let changeBalance = 0;

            //Generate numbers and calculate payout
            if (number < 500) {

                prize = "Uh Oh";
                won = "0x";
                payout = 0;
                changeBalance = (bet * -1);
                footer = "oof";

            } else if (number >= 500 && number < 900) {

                prize = "one";
                won = "1x";
                payout = bet;
                changeBalance = 0;
                footer = "at least you get your money back";

            } else if (number >= 900 && number < 990) {

                prize = "two";
                won = "2x";
                payout = (bet * 2);
                changeBalance = bet;
                footer = "not bad";

            } else if (number >= 990 && number < 998) {

                prize = "grand";
                won = "Grand Prize";
                payout = (bet * 5);
                changeBalance = (bet * 4);
                footer = "such luck";

            } else if (number > 998) {

                prize = "jackpot";
                won = "Jackpot";
                payout = (bet * 10);
                changeBalance = (bet * 9);
                footer = "wew";

            }

            //Update Balance
            economy.updateBalance(message.author.id, parseInt(changeBalance)).then((r) => {

                const embed = new Discord.RichEmbed()
                    .setTitle(`Pocari Casino`)
                    .setDescription(message.author.username)
                    .setThumbnail(message.author.avatarURL)
                    .setFooter(footer)
                    .setTimestamp()
                    .setColor(0xD4AF37)
                    .addField("Your Number", number, true)
                    .addField("Amount Waged", bet + "/-", true)
                    .addField("Prize Won", won + ": " + payout + "/-", true)
                    .addBlankField()
                    .addField(`${message.guild.name} Bank`, message.author.username)
                    .addField("Starting Balance", i.money + "/-", true)
                    .addField("New Balance", r.money + "/-", true)

                message.channel.send(embed);
                    
            })

        }

    })
}