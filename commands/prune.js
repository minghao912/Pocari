exports.run = (client, message, args, func) => {

	//wrapping in async, awaits only works in asyncs
	async function purge() {
		message.delete(); //deleting the command message, so it doesn't interfere with intended deletions

		//Make sure user has correct permissions
		if (!message.member.roles.find("name", "‘Honourary Mod’")) { //Checks if they DON'T have the role, (!) inverts the true/false
			message.channel.send(`<@${message.author.id}>` + 'Whatcha tryin\' to do, huh? I see you. You need the `\'Honourary Mod\'` role to use this command.'); //Tells the sneaky little user to get the role first
			console.log(`> @${message.author.username} was trying to delete messages without permission. But because Pocari is a good bot, Pocari stopped them!`);
			return; //Cancels rest of script
		}

		//Making sure argument is a number
		if (isNaN(args[0])) {
			//Send message to channel.
			message.channel.send('Pocari can\'t delete messages if you don\'t specify the number of messages to delete! \nPlease use a number as your argument. \nUsage: ' + prefix + 'purge <amount>'); //Describes usage of the PURGE command
			//Cancel rest of script, so the rest of script doesn't run (will return error otherwise)
			return;
		}
		if (args[0] == 1) {
			message.channel.send('Please specify an amount of messages to delete that is greater than one (1), or Discord will go all out errors.');
			return;
		}
		if (args[0] >= 100) {
			message.channel.send('Please specify an amount of messages to delete that is less than one hundred (100).')
			return;
		}

		const fetched = await message.channel.fetchMessages({limit: args[0]}); //this grabs the last number(args) of message in the channel
		console.log('> Pocari has found a total of ' + fetched.size + ' messages, currently deleting...'); //sending notification to console of how many messages to delete

		//Deleting messages
		message.channel.bulkDelete(fetched)
			.catch(error => message.channel.send(`Error: ${error}`)); //Just in case there's an error, it'll say on the channel
	}

	//Making sure this function gets called whenever a PURGE command is run
	purge(); //This has to be inside if(msg.startsWith)

	//Make sure the variable is a nubmer (in command)

}