const Discord = require('discord.js')
const economy = require('discord-eco')
const fs = require('fs');
const tokenJSON = fs.readFileSync('./Storage/tokens.json', 'utf8')
const tokens = JSON.parse(tokenJSON);

exports.run = async (client, message, author, func) => {

    //Define Variable
    let args = message.content.slice(tokens.prefix.length).trim().split(" ").slice(1);

    console.log(args);

    //Check message arguments
    if (!args[0]) {
        const embed = new Discord.RichEmbed()
            .setTitle('**Pocari\'s Higher or Lower**')
            .setDescription('*Pocari will select a number. You may guess whether the next roll will be higher or lower.*')
            .setColor(0xD4AF37)
            .addBlankField()
            .addField("If you are **correct** you will win", "2x wager", true)
            .addField("If you are **incorrect** you will lose", "1x wager", true)
            .addBlankField()
            .addField("Correct Usage", `\`${tokens.prefix}highlow <amount>\``, false)

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
            message.channel.send(`Pocari is getting a number...`);

            //Roll 1st no.
            let firstRoll = func.randomNumGenInc(35, 65)

            //Ask user for guess
            const embed = new Discord.RichEmbed()
                .setTitle(`Pocari Casino`)
                .setDescription('Hi-Lo')
                .setColor(0xD4AF37)
                .addField('Will the next number be higher or lower than', firstRoll, false)
                .addBlankField()
                .addField('Select', '[1] Higher\n[2] Lower')

            message.channel.send(embed);

            //Await response
            const userResponse = async () => {
                try {
                    const msgs = await message.channel.awaitMessages(msg => {
                        return msg.content.includes(1) || msg.content.includes(2);
                    }, {max: 2})

                    let msgContent = msgs.map(msg => msg.content);
                    let hilo;

                    //Determine if user put higher or lower
                    if (msgContent.includes('1')) {
                        message.channel.send('You have selected: higher');
                        hilo = "higher";
                    } else if (msgContent.includes('2')) {
                        message.channel.send('You have selected: lower');
                        hilo = "lower";
                    } else {return message.channel.send('You have not selected a valid option.');}

                    //Roll 2nd time
                    let secondRoll = func.randomNumGenInc(0, 100);

                    console.log(secondRoll);

                    let NumHiLo;

                    //Determine if 2nd roll is higher or lower
                    if (secondRoll > firstRoll) {NumHiLo = "higher";}
                    if (secondRoll < firstRoll) {NumHiLo = "lower";}
                    else {NumHiLo = "Jackpot"}

                    console.log(NumHiLo);

                    //Make embed
                    const embed = new Discord.RichEmbed()
                        .setTitle('Pocari Casino')
                        .setDescription('Hi-Lo')
                        .setColor(0xD4AF37)
                        .setThumbnail(message.author.avatarURL)

                    if (NumHiLo = hilo) {
                        embed.addField('You were correct!', `The 2nd roll was ${NumHiLo}.`, true)
                        embed.addField('Amount Waged', args[0])
                        embed.addField('Prize Won', '2x: ' + (args[0] * 2), true)
                        embed.addBlankField()
                        embed.addField(`${message.guild.name} Bank`, message.author.username, false)
                        
                        economy.updateBalance(message.author, args[0]).then((r) => {
                            embed.addField('Starting Balance', i.money, true)
                            embed.addField('New Balance', r.money, true)
                        })

                        message.channel.send(embed);

                    } else if (NumHiLo != hilo) {
                        embed.addField('You were incorrect!', `The 2nd roll was ${NumHiLo}.`, true)
                        embed.addField('Amount Waged', args[0])
                        embed.addField('Prize Lost', '0x: ' + (args[0] * 1), true)
                        embed.addBlankField()
                        embed.addField(`${message.guild.name} Bank`, message.author.username, false)
                        
                        economy.updateBalance(message.author, (args[0] * -1)).then((r) => {
                            embed.addField('Starting Balance', i.money, true)
                            embed.addField('New Balance', r.money, true)
                        })

                        message.channel.send(embed)
                    }
                    
                } catch(err) {console.error}  
            } 
            
            userResponse();
        }
    })

}