const Discord = require('discord.js');
const fs = require('fs');
const tokenJSON = fs.readFileSync('./Storage/tokens.json', 'utf8')
const tokens = JSON.parse(tokenJSON);

exports.run = (client, message, args, tools) => {

    let pages = [   //Define an array of pages
                `**Command name.**\n*Description of the command. \nCorrect usage of the command.* \n\`${tokens.prefix}command <required> [optional]\``,
                `**Balance**\n*Displays the user\'s current monetary balance.*\n\`${tokens.prefix}balance [user]\``,
                `**Supported Convert Units**\n*Displays supported units for the \`${tokens.prefix}convert\` command.*\n\`${tokens.prefix}convert_supported\``,
                `**Convert**\n*Converts between the supported units listed in \`${tokens.prefix}convert_supported\`*\n\`${tokens.prefix}convert <amount> <start unit> <destination unit>\``,
                `**Direct Message**\n*DMs a specified user a special message.*\n\`${tokens.prefix}dm <user> <message>\``,
                `**Emoji List**\n*Lists the server's emojis.*\n\`${tokens.prefix}emojilist\``,
                `**Forecast**\n*Shows the weather forecast for a selected location*\n\`${tokens.prefix}forecast <location>\``,
                `**Fortnite Statistics**\n*Displays statistics of the specified Fortnite player.*\n\`${tokens.prefix}fortnitestats <pc | xbl | psn> <user>\``,
                `**Fortnite Weapon Statistics**\n*Displays statistics for the specified Fortnite weapon.*\n\`${tokens.prefix}fortniteweapon <Weapon Type> <Subtype> <Rarity>\``,
                `**Help**\n*Displays a list of commands along with their correct usage.*\n\`${tokens.prefix}help\``,
                `**Let Me Google That For You**\n*Sends a lmgtfy link in the current channel.*\n\`${tokens.prefix}lmgtfy <topic>\``,
                `**Meme**\n*Retreives a random meme.*\n\`${tokens.prefix}meme [topic]\``,
                `**Message Amount**\n*Displays the user's message count and level.*\n\`${tokens.prefix}message\``,
                `**Money**\n*Displays the user's current monetary balance.*\n\`${tokens.prefix}money [user]\``,
                `**Ping**\n*Pings the server and displays the current latency.*\n\`${tokens.prefix}ping\``,
                `**Prune/Purge**\n*Deletes a specified amount of pages in the current channel.*\n\`${tokens.prefix}prune | purge <number of messages>\``,
                `**Transfer**\n*Transfer money to a specified user.*\n\`${tokens.prefix}transfer <amount> <user>\``,
                `**User List**\n*Lists the users in the server.*\n\`${tokens.prefix}users\``,
                `**Weather**\n*Displays weather information for a selected location*\`${tokens.prefix}weather <location>\``
            ];

    let page = 1;   //Define what page we are on here, the default page is set to 1

    const embed = new Discord.RichEmbed()
        .setColor(0x39b22e)
        .setFooter(`Page ${page} of ${pages.length}`)
        .setDescription(pages[page-1])

    message.channel.send(embed).then(msg => {

        msg.react('◀').then( r => {
            msg.react('▶')

            //Filters = These make sure the variables are correct before running some code
            const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

            const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
            const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

            //Handle the collections
            backwards.on('collect', r => {  //Runs when backwards reaction is found
                if (page === 1) return;
                page--; //If it can go back, push back the page number
                embed.setDescription(pages[page-1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed) //Push the edit to the message
            })

            forwards.on('collect', r => {
                if (page === pages.length) return;
                page++; //If it can go forward, push back the page number
                embed.setDescription(pages[page-1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed) //Push the edit to the message
            })
        })

    })

}