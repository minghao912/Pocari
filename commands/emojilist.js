exports.run = (client, message, author, args) => {

    const ejoji = message.guild.emojis.map(e => e.toString())
    
    message.channel.send(`Emoji List for ${message.guild.name}`);
    message.channel.send(ejoji);
    

    console.log(`> ${message.author.username} has requested a list of emoji for ${message.guild.name}`);

}