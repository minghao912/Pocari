//Calling Dependencies and Packages
const Discord = require('discord.js');
const weather = require('weather-js');
const client = new Discord.Client();
const fs = require('fs'); 

//Calling Commands JSON file
const commands = JSON.parse(fs.readFileSync('Storage/commands.json', 'utf8'));

//Call the file with all the functions here.
const func = require('./functions.js');
console.log(func)

//Client Prefix (Use this prefix to trigger client)
var prefix = "=";

//Functions
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
					then(webhook => {
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
								console.log(error);
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
								console.log(error);
								return channel.send('**Something went wrong when sending the webhook. Please check the console.**');
							})
					}

		})
}

//Client 'On' Confirmation
client.on('ready', () => {
	console.log("> You thirsty?");
});


//Client Responses
client.on('message', message => {
	
	//Variables
	let msg = message.content.toUpperCase(); //now the message isn't case sensitive. Yay! And I don't have to type it out everytime. yeet
	let sender = message.author; //now i don't have to call this command ever again, and all I have to do is say 'sender'
	let args = message.content.slice(prefix.length).trim().split(" "); //slices off the prefix, then puts the rest in an easily accessible array
	let cmd = args.shift().toLowerCase(); //takes away the first object in cont array, then puts it in this.

	//So it doesn't respond to clients
	if (sender.client) return;
	if (!message.content.startsWith(prefix)) return; //Also make sure the message does not start with the prefix, return.
	const func = require('./functions.js');

	//Command Handler
	try {

		let commandFile = require(`./commands/${cmd}.js`); //This will assign that filename to commandFile
		commandFile.run(client, message, args, func); //This will add the functions, from the functions.js file, into each commandFile.

	} catch(e) { //If an error occurs, this will run.

		console.log(e.message);

	} finally { //This will run after the first two clear

		console.log(`${message.author.username} ran the command: ${cmd}`);

	}


	//Commands

	//Simple Test Command
	if (message.content === prefix + "On") {
		message.channel.sendMessage("Ya thirsty?");
	}

	//Latency Ping/Pong Test
	if (message.content === prefix + "Ping") { 
		message.channel.send(`Pong! Pocari has calculated your ping to be ${Math.round(client.ping)}ms`);
		console.log("> pong-ed" + message.author.username);
	}

	//Shutdown
	if (message.content === prefix + "shutdown") {
		message.channel.send("Pocari's out of juice, ma boi!");
		console.log("> Powering Off...");
		message.channel.send("Pocari out!");
		console.log("> Pocari out!");
		function Exit_Process() {
			process.exit(0); //This is a crude exit, but it'll do (until I can find a cleaner way THAT ACTUALLY WORKS)
		}
		setTimeout(Exit_Process, 3000);
	}

	//Purge
	if (msg.startsWith(prefix + 'PURGE')) { //Using 'startsWith' since there are arguments at end
		//wrapping in async, awaits only works in asyncs
		async function purge() {
			message.delete(); //deleting the command message, so it doesn't interfere with intended deletions

			//Make sure user has correct permissions
			if (!message.member.roles.find("name", "‘Honourary Mod’")) { //Checks if they DON'T have the role, (!) inverts the true/false
				message.channel.send('Whatcha tryin\' to do, huh? I see you. You need the `\'Honourary Mod\'` role to use this command.'); //Tells the sneaky little user to get the role first
				return; //Cancels rest of script
			}

			//Making sure argument is a number
			if (isNaN(args[0])) {
				//Send message to channel.
				message.channel.send('Pocari can\'t delete messages if you don\'t specify the number of messages to delete! \nPlease use a number as your argument. \nUsage: ' + prefix + 'purge <amount>'); //Describes usage of the PURGE command
				//Cancel rest of script, so the rest of script doesn't run (will return error otherwise)
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
		//Set permissions for the PURGE command
	}

	//Weather - requires the 'weather-js' package
	//Allowing for degree to be changed

	if (msg.startsWith(prefix + 'WEATHER')) { //Checks for the calling of WEATHER command
		

		weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
			if (err) message.channel.send(err);

			//Just in case the location entered is inalid.
			if (result.length === 0) {
				message.channel.send('**Pocari can\'t find a matching place name with whatever rubbish you entered in as a place name. \nPlease enter a valid location.**');
				return; //Exits the code, doesn't run rest of function
			}

			//Variables
			var current = result[0].current; //Variable for current part of the JSON output
			var location = result[0].location; //Variable for location part of the JSON output

			var timezonePlusMinus = 0; //Variable for timezone +/-
			if (location.timezone > 0) {
				timezonePlusMinus = `UTC +${location.timezone}`;
			}
			else if (location.timezone <= 0) {
				timezonePlusMinus = `UTC ${location.timezone}`;
			}

			//Unit conversions
			let alteredTemperature = current.temperature;
			let alteredFeelsLike = current.feelslike;
			let degreeUsed = 'C';
			parseInt(current.temperature);

			if (msg.startsWith(prefix + 'WEATHER_F')) {
				degreeUsed = 'F';
				alteredTemperature = current.temperature * (9 / 5) + 32;
				alteredFeelsLike = current.feelslike * (9 / 5) + 32;
			}
			if (msg.startsWith(prefix + 'WEATHER_K')) {
				degreeUsed = 'K';
				alteredTemperature = current.temperature * 1 + (273.15);
				alteredFeelsLike = current.feelslike * 1 + (273.15);
			}
			if (msg.startsWith(prefix + 'WEATHER_RE')) {
				degreeUsed = 'Ré';
				alteredTemperature = current.temperature * (5 / 4);
				alteredFeelsLike = current.feelslike * (5 / 4);
			}
			else if (msg.startsWith(prefix + 'WEATHER_C')) {
				degreeUsed = 'C';
				alteredTemperature = current.temperature;
				alteredFeelsLike = current.feelslike;
			}

			//Using a fancy schmancy embed for this. Classy, ma bois
			const embed = new Discord.RichEmbed()
				.setDescription(`**${current.skytext}**`) //Text of what the sky looks like {refer to weather-js npm page}
				.setAuthor(`Weather for ${current.observationpoint}`) //Shows the current location of weather (from weather-js observation point)
				.setThumbnail(current.imageUrl) //Sets the thumbnail of the embed
				.setColor(0x00AE86) //Sets colour of embed, can change later (hex value only, 0x infront)
				.addField('Timezone',timezonePlusMinus, true) //Adds field for timezone, uses earlier timezone variable
				.addField('Degree Type',`°` + degreeUsed, true) //Adds field to show the degree type, is 'inline'
				.addField('Temperature', alteredTemperature + `°`, true)
				.addField('Feels Like', alteredFeelsLike + `°`, true)
				.addField('Winds',current.winddisplay, true)
				.addField('Humidity', `${current.humidity}%`, true)

				//Now to display this embed when called
				message.channel.send({embed});
			
		})
	}

	//Hooks
	if (msg.startsWith(prefix + 'HOOK')) {

			//Deleting message that user sends
			message.delete();

			if (msg === prefix + 'HOOK') { //Checks if it is only 'HOOK' that was sent
				return hook(message.channel, 'Hook Usage', `${prefix}hook <title>, <message>, [HEXcolor], [avatarURL]\n\n**<> is required\n[] is optional**`, 'FC8469','httpsi.imgur.com8jgXoSr.png');
			}

			let hookArgs = message.content.slice(prefix.length + 4).split(","); //This slices the first 6 letters (prefix & the word HOOK) then splits them by 'commas'

			hook (message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]); //This calls the hook
	}

	//Help command w/ category system.
	
})

//Client Login
var token = [REDACTED];
client.login(token);