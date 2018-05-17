const Discord = require('discord.js');
const economy = require('discord-eco');
const fs = require('fs');
const tokenJSON = fs.readFileSync('./Storage/tokens.json', 'utf8')
const tokens = JSON.parse(tokenJSON);

exports.run = (client, message, author, func) => {

    //Define Variable
    let args = message.content.slice(tokens.prefix.length).trim().split(" ").slice(1);

    //Define Functions
    function makeAnEmbed (title, description, thumbnail, colour, StartBalance, AddAmount, NewBalance, footer) {
        const embed = new Discord.RichEmbed()
            .setTitle(title)
            .setDescription(description)
            .setThumbnail(thumbnail)
            .setColor(colour)
            .addField('Starting Balance', StartBalance, true)
            .addField('Amount Added', AddAmount, true)
            .addField('New Balance', NewBalance, false)
            .setFooter(footer)

        message.channel.send(embed);
	}

    //Check message arguments
    if (!args[0]) {
        return message.channel.send(`**You need to define an amount. What's the point of Pocari adding nothing? I have a life you know!\nCorrect Usage: ${tokens.prefix}transfer <amount> <user>**`);
    }
    if (args[0] <= 0) {
        return message.channel.send(`**Please enter an amount to transfer greater than zero (0).**`);
    }
    if (isNaN(args[0])) {
        return message.channel.send(`**This ammount has to be a number. This isn't math class!\nCorrect Usage: ${tokens.prefix}transfer <amount> <user>**`);
    }

    //Define User
    let definedUser = '';
    if (!args[1]){
        return message.channel.send(`**You need to define a user. Who am I supposed to transfer money to? God? He don't need your money!\nCorrect Usage: ${tokens.prefix}transfer <amount> <user>**`);
    } else if (message.mentions.users.first().id === message.author.id) {
        return message.channel.send(`**Why are you trying to give money to yourself? Stop wasting my time!**`);
    } else {
        let firstMentioned = message.mentions.users.first();
        definedUser = firstMentioned.id;
        mentionedUser = firstMentioned.username;
        avatarUser = firstMentioned.avatarURL;
    }

    economy.fetchBalance(message.author.id).then((i) => {
        
        //See if giver has enough money
        if (args[0] > i.money) {
            let defecit = args[0] - i.money;
            return message.channel.send(`**You don't have enough money to make this transfer. LOOOOOSER!\nRequired Amount: ${args[0]}/-\nCurrent Balance: ${i.money}/-\nDefecit: ${defecit}**`);
        } else {
            //Await Response
            let PIN = Math.floor(Math.random() * (9999 - 0000 + 1))
            message.channel.send(`**You have initiated a transfer of ${args[0]}/- to ${mentionedUser}. To confirm this transaction, please type in the following verification PIN: \`${PIN}\`.**`)
            console.log(`> ${message.author.username} has intitiated a transfer of ${args[0]}/- to ${mentionedUser}.`);

            const PINVerif = async () => {
                try {
                    const msgs = await message.channel.awaitMessages(msg => {
                        return msg.content.includes(PIN);
                    }, {max: 2})

                    let confMsg = msgs.map(msg => msg.content).slice(1).join(", ");

                    if (confMsg.includes(PIN)) {
                        economy.updateBalance(definedUser, args[0]).then((q) => {
                            
                            makeAnEmbed(`**${message.guild.name} Bank**`, '**Transaction Information (Recipient)**', avatarUser, 0xD4AF37, (q.money * 1) - args[0] + "/-", args[0] + "/-", q.money + "/-", 'ka-ching!');
            
                        })

                        let subAmount = '-' + args[0];
                        economy.updateBalance(message.author.id, subAmount).then((r) => {
                            
                            makeAnEmbed(`**${message.guild.name} Bank**`, '**Transaction Information (Sender)**', message.author.avatarURL, 0xD4AF37, (parseInt(r.money) * 1 + parseInt(args[0])) + "/-", args[0] + "/-", r.money + "/-", 'ka-ching!');
                            
                        })
                    } else {
                        return message.channel.send(`**This transaction has not been verified. Please try again.**`);
                    }

                } catch (e) {
                    console.log(e);
                }
            }

            PINVerif();
            
            console.log(`> ${message.author.username} has completed a transfer of ${args[0]}/- to ${mentionedUser}.`);
            
        }
    })



}