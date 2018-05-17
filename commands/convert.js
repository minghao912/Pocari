const convert = require('convert-units');
const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client, message, msg, prefix, func) => {
	
	//Variables
	let args = message.content.slice(prefix.length).trim().split(" ");

	if (args[1] == null) {

		message.channel.send(`**Pocari can\'t convert things if you don\'t specify what to convert!**\n\nProper usage of a conversion is: =convert <Starting Measurement> <Starting Unit> <Destination Unit>\n\nTo view list of supported units, use =convert_supported`);
		return;

	}

	if (args[2] == null) {

		message.channel.send(`**Pocari can\'t convert things if you don\'t specify what to convert!**\n\nProper usage of a conversion is: =convert <Starting Measurement> <Starting Unit> <Destination Unit>\n\nTo view list of supported units, use =convert_supported`);
		return;

	}

	if (args[3] == null) {

		message.channel.send(`**Pocari can\'t convert things if you don\'t specify what to convert!**\n\nProper usage of a conversion is: =convert <Starting Measurement> <Starting Unit> <Destination Unit>\n\nTo view list of supported units, use =convert_supported`);
		return;

	}

	//Code
	let startUnit = args[2];
	let endUnit = args[3];
	let conversion = convert(args[1]).from(startUnit).to(endUnit);
	let endProduct = conversion + ' ' + args[3];

	const embed = new Discord.RichEmbed()
		.setTitle(`Unit Conversions`)
		.setDescription(`for @${message.author.username}`)
		.setColor(0xB30753)
		.addField('Starting Unit', args[2], true)
		.addField('Destination Unit', args[3], true)
		.addField('Starting Measurement', args[1] + ' ' + args[2], true)
		.addField('Final Result', endProduct, true)

	message.channel.send({embed})

	console.log(`> ${message.author.username} has requested a conversion of ${args[1]}${args[2]} to ${args[3]}.`);

	if (messageSend = null) {
		message.channel.send(`Oh noes! Pocari has encountered an error with your request. Please ensure you have used a compatible unit and/or correct formatting.`);
	}



}