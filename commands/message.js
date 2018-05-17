//Now, let's let the usser fetch their level & messages
const db = require('quick.db');
const Discord = require('discord.js');

exports.run = (client, message, args, func) => {

	let definedUser = '';
	let avatarUserURL = ''
	if (!args[0]) {
		definedUser = message.author;
		avatarUserURL = message.author.avatarURL;
	} else {
		let firstMentioned = message.mentions.users.first();
		definedUser = firstMentioned;
		avatarUserURL = firstMentioned.avatarURL;
	}

	db.fetchObject(definedUser.id + message.guild.id).then(i => {	//This is the object of messages sent
		db.fetchObject(`userLevel_${definedUser.id + message.guild.id}`).then(o => {	//This is the object of their level
			const embed = new Discord.RichEmbed()
				.setDescription(`**Message Count**`)
				.setAuthor(definedUser.username)
				.setColor(0x6DBFFF)
				.setThumbnail(avatarUserURL)
				.addField('Messages Sent', i.value + 1, true)
				.addField('Level', o.value, true)

			message.channel.send({embed}); //This returns their messages and level, the reason +1 is used for messages is because when someone calls this command, it also adds 1 earlier at the same, but since this is fetching the previous value, we need to add 1 to the answer, even though it will be updated seconds after this.

			console.log(`> User ${message.author.username} has requested message stats for ${definedUser.username}, who is at ${i.value} messages sent and Level ${o.value}.`);

		})
	})

}