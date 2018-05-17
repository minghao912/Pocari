exports.run = (client, message, args, msg, prefix, func) => {

	//Dependencies
	const convert = require('convert-units');
	const Discord = require('discord.js'); 

	//List of Supported Units
	let supportedUnits = convert().possibilities();

	message.channel.send(`**Supported Units are:** ${supportedUnits}`);


}