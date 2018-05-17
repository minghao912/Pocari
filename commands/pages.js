const Discord = require('discord.js');

exports.run = (client, message, args, tools) => {

    let pages = ['This is page one!', 'Second Page', 'Third Page']; //Here define an array of pages
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