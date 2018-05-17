exports.run = (client, message, msg, prefix, args, func) => {

	//Deleting message that user sends
	message.delete();

	if (msg === prefix + 'HOOK') { //Checks if it is only 'HOOK' that was sent
		return hook(message.channel, 'Hook Usage', `${prefix}hook <title>, <message>, [HEXcolor], [avatarURL]\n\n**<> is required\n[] is optional**`, 'FC8469','httpsi.imgur.com8jgXoSr.png');
	}

	let hookArgs = message.content.slice(prefix.length + 4).split(","); //This slices the first 6 letters (prefix & the word HOOK) then splits them by 'commas'

	hook(message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]); //This calls the hook

	//Hook Function
	function hook(channel, title, message, color, avatar) { //This function uses many options. Last two are optional.

		//Reassign default parameters - if any are blank
		if (!channel) return console.log('> Channel not specified.');
		if (!title) return console.log ('> Title not specified.');
		if (!message) return console.log ('> Message not specified.');
		if (!color) color = 'd9a744'; //This is optional, so I have to give it a default HEX colour.
		if (!avatar) avatar = 'httpsi.imgur.com8jgXoSr.png' //This is also optional, changing the default avatar to Pocari's peach

		//Removing spaces from color & URL
		color = color.replace(/\s/g, '');
		avatar = avatar.replace(/\s/g, '');

		//Creating the Webhook
		channel.fetchWebhooks() //This gets webhooks in the channel
			.then(webhook => {

				//Fetching webhook used
				let foundHook = webhook.find('name', 'Pocari');

				//This runs if webhook is not found
				if (!foundHook) {
					channel.createWebhook('Pocari', 'httpsi.imgur.com8jgXoSr.png'); //Make sure this is the same as avatar above and name above
						.then(webhook => {
							//Send the webhook
							webhook.send('', {
								"username": title,
								"avatarURL": avatar,
								"embeds": [{
									"color": parseInt(`0x${color}`),
									"description":message
								}]
							})
								.catch(error => {//Reporting an error, if found
									console.log(`> ` + error);
									return channel.send('**Something went wrong when sending the webhook. Please check the console.**');
								})
						})
				} else { //The first webhook is only for if it couldn't find the original webhook
							foundHook.send('', {
								"username": title,
								"avatarURL": avatar,
								"embeds": [{
									"color": parseInt(`0x${color}`),
									"description":message
								}]
							})
								.catch(error => {//Reporting an error, if found
									console.log(`> ` + error);
									return channel.send('**Something went wrong when sending the webhook. Please check the console.**');
								})
						}

			})
	}


}