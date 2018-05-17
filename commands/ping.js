exports.run = (client, message, args, func) => {

	const Discord = require('discord.js');


	const embed = new Discord.RichEmbed()
		.setDescription(`**Pong!**`)
		.setThumbnail(message.author.avatarURL)
		.setColor(0xB69CFF)
		.addField('User', message.author.username, true)
		.addField('Latency', `~${client.ping}ms`, true)

	message.channel.send({embed});

}