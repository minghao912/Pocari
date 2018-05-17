//Calling Dependencies and Packages
const Discord = require('discord.js');
const weather = require('weather-js');
const client = new Discord.Client();
const fs = require('fs'); 
const db = require('quick.db');
const convert = require('convert-units');	//For conversions
const economy = require('discord-eco');
const moment = require('moment');	//Lets you view the current date and time
const http = require('http');	//Does stuff with http links
const https = require('https'); //Does stuff with https links
const $ = require('jquery');
const request = require('request');


//Calling functions file
const func = require('./functions.js'); //Replace with '../function.js' if returning error or on Ubuntu/Linux

//Calling JSON files
const commands = JSON.parse(fs.readFileSync('Storage/commands.json', 'utf8'));
const userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
const tokens = JSON.parse(fs.readFileSync('Storage/tokens.json', 'utf8'));
const items = JSON.parse(fs.readFileSync('Storage/items.json', 'utf8'));
const memes = JSON.parse(fs.readFileSync('Storage/memes.json', 'utf8'));

//Client Prefix (Use this prefix to trigger client)
const prefix = ">";


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
	let cmd = args.shift().toLowerCase(); //This takes away the first object in the cont array, then puts it in this.
	
	if (client.user.id === message.author.id) {return;}	//Stops the message if the bot sends the message. (Bot doesn't have account)

	//This function allows for commands to be run outside of this here.
	function commandRun(nameOfFile) {
		const functionToBeRun = require(`./commands/${nameOfFile}`);
		functionToBeRun.run(client, message, args, func, prefix);
	}

	//Run server stats on startup
	commandRun('[LIMITED]serverstats.js');

	//Message Levelling System
	db.updateValue(message.author.id + message.guild.id, 1).then(i => { //You pass it the key, which is authorID + guildID, then pass it an increase which is 1 in this instance

		//It also returns the new updated object, which is what we will use.
	
		let messages;	//Creating an empty var - these if statements run if the new amount of messages is the same as the number.
			
		if (!sender.bot) {
			if (i.value == 25) messages = 25;	//Level 1
			else if (i.value == 50) messages = 50;	//Level 2
			else if (i.value == 100) messages = 100;	//Level 3
			else if (i.value == 200) messages = 200;	//Level 4
			else if (i.value == 350) messages = 350;	//Level 5
			else if (i.value == 500) messages = 500;	//Level 6
			else if (i.value == 750) messages = 750; 	//Level 7
			else if (i.value == 1000) messages = 1000; 	//Level 8
			else if (i.value == 1500) messages = 1500; 	//Level 9
			else if (i.value == 2000) messages = 2000; 	//Level 10
			else if (i.value == 3000) messages = 3000; 	//Level 11
			else if (i.value == 5000) messages = 5000; 	//Level 12
	
			if (!isNaN(messages)) {	//If messages IS STILL empty, run this.
	
				db.updateValue(`userLevel_${message.author.id + message.guild.id}`, 1).then(o => {	//This returns the updated object of userLevel_ID.
					const embed = new Discord.RichEmbed()
						.setDescription(`**Level Up!**`)
						.setAuthor(message.author.username)
						.setThumbnail(message.author.avatarURL)
						.setColor(0x6DBFFF)
						.addField('You have sent:', `${messages} messages`, true)
						.addField('You have levelled up to:', `Level ${o.value}`)
	
					message.channel.send({embed});	//Send their updated level to the channel.
				})
	
			}
		} else { return; }
	
	})
	
	//Make sure it doesn't respond to bots
	if (sender.bot) return;
	
	//Events
	let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

	if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {};	//Create a JSON file for their user + guild
	if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 1000;	//Creates money object
	if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = 'Not Collected';
	if (!userData[sender.id + message.guild.id].username) userData[sender.id + message.guild.id].username = message.author.username;	//Creates an object with user's username
	if (!userData[sender.id + message.guild.id].convert) userData[sender.id + message.guild.id].convert = 'Not Bought';

	const memes = JSON.parse(fs.readFileSync('Storage/memes.json', 'utf8'));

	let emoteName = '';
	let emotePreMessage = `> ${message.author.username} requested the emote `;


	//Commands
	//Emote Responses
	if (msg.includes("WHAT THE FUCK DID YOU JUST FUCKING SAY ABOUT ME") || msg.includes("WTF")) {

		console.log(emotePreMessage + `"WTF".`);
		message.channel.send("", {file: memes.wtf.location});
		return;

	}
	
	if (msg.includes("MOO") || msg.includes("PERHAPS") || msg.includes("COW")) {

		console.log(emotePreMessage + `"PERHAPS".`);
		message.channel.send("", {file:memes.perhaps.location});
		return;

	}

	if (msg.includes("QUACK") || msg.includes("DUCK")) {
		
		console.log(emotePreMessage + `"MAC QUACK".`);
		message.channel.send("", {file: memes.quack.location});
		return;

	}

	if (msg.includes("RADENTTT") || msg.includes("KUG") || msg.includes("WOO")) {
		
		console.log(emotePreMessage + `"rAdEnttt Kug woo".`);
		message.channel.send("", {file: memes.rAdEnttt_Kug_woo.location});
		return;

	}

	if (msg.includes("PATRICK") && msg.includes("GENIUS")) {

		console.log(emotePreMessage + `"Patrick The Genius".`);
		message.channel.send("", {file: memes.patrick_the_genius.location});
		return;

	}

	if (msg.includes("THINK") && msg.includes("ABOUT") && msg.includes("IT")) {

		console.log(emotePreMessage + `"Think About It".`);
		message.channel.send("", {file: memes.thinkaboutit.location});
		return;

	}

	//Return if no prefix
	if (!msg.startsWith(`>`)) {return;}

	//Buy Command
	if (msg.startsWith(`${prefix}BUY`)) {

		fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
			if (err) console.log("> " + err);
		})

		//Variables
		let categories = [];	//Define categories as an empty array

		//If item is not specified, show a list of items.
		if (!args.join(" ")) {

			//Fetch all Categories
			for (var i in items) {

				//Push the categories to the 'categories' array
				if (!categories.includes(items[i].type)) {
					categories.push(items[i].type)
				}
			}

			//Start the embed
			const embed = new Discord.RichEmbed()
				.setDescription('Available Items')
				.setColor(0xD4AF37)

			for (var i = 0; i < categories.length; i++) {	//This runs off how many categories there are.
				
				var tempDesc = '';

				for (var c in items) {
					if (categories[i] === items[c].type) {
						tempDesc += `${items[c].name} - **${items[c].price}** - ${items[c].desc}\n`;
					}	
				}

				embed.addField(categories[i], tempDesc);

			}

			return message.channel.send({embed});

		}

		//Buying Items
		//Item Info
		let itemName = '';
		let itemPrice = 0;
		let itemDesc = '';

		for (var i in items) {
			if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) {
				itemName = items[i].name;
				itemPrice = items[i].price;
				itemDesc = items[i].desc;
			}
		}

		//Item not found
		if (itemName === '') {
			return message.channel.send(`**Item \"${args.join(" ").trim().toUpperCase()}\" is a nonexistent item. Are you *trying* to buy a nonexistent item? Good luck!**`);
			console.log(`> ${message.author.username} has attempted to purchase a nonexistent item.`);
		}

		//Check if they have enough money 
		console.log(itemName);
		economy.fetchBalance(message.author.id).then((e) => {
			if (parseInt(e.money) < parseInt(itemPrice)) {
				let priceDifference = parseInt(itemPrice) * 1 - parseInt(e.money);
				message.channel.send(`**You don't have enought money for this item. HA! Loooser! You are currently ${priceDifference}/- away.**`);
				console.log(`> ${message.author.username} tried to purchase ${itemName} for ${itemPrice} but was ${priceDifference}/- short. ¡Que Lastima!`);
				return;
			}

			if (itemName === "Convert Command") {
				if (userData[sender.id + message.guild.id].convert = 'Bought') {
					message.channel.send("**You have already bought the \"CONVERT COMMAND\" item.**");
					return;
				} else {console.log("> a");}
			}

			//If have enough money, continue
			economy.updateBalance(message.author.id, parseInt(`-${itemPrice}`)).then((i => {
				console.log(`> ${message.author.username} has bought the Item ${itemName} for ${itemPrice}. Their current balance is ${i.money}/-.`);
				message.channel.send('**You bought ' + itemName + ' for ' + itemPrice + "!**");

				//If statements to run when they buy an item.
				if (itemName.toLocaleLowerCase === 'POCARI MANAGER') {
					message.guild.members.get(message.author.id).author.member.addRole(message.guild.roles.find("name", "Pocari Manager"));
				}

				if (itemName === 'Convert Command') {
					userData[sender.id + message.guild.id].convert = 'Bought';
				}

			}))

		})
		return;
	}

	//Daily Reward
	if (msg == prefix + "DAILY") {

		console.log(`> ${sender.username} ran the command: daily`);

		if (userData[sender.id + message.guild.id].lastDaily != moment().format('L')) {
			userData[sender.id + message.guild.id].lastDaily = moment().format('L')
			economy.updateBalance(sender.id, '500').then((i) => {
				console.log(`> ${sender.username} has redeemed their daily reward. Their current balance is ${i.money}.`);
				const embed = new Discord.RichEmbed()
					.setTitle(`**${message.guild.name} Bank**`)
					.setDescription(`Daily Reward`)
					.setColor(0xD4AF37)
					.setThumbnail(message.author.avatarURL)
					.addField('Previous Balance', i.money * 1 - 500 + "/-", true)
					.addField('Current Balance', i.money + "/-", true)
	
				message.channel.send({embed});
			})
		} else {
		   const embed = new Discord.RichEmbed()
				.setTitle(`**${message.guild.name} Bank**`)
				.setDescription('You have already redeemed your daily reward. Cheater! You can redeem your next daily reward **' + moment().endOf('day').fromNow() + '**.')
				.setColor(0xD4AF37)

			console.log(`> ${sender.username} has attempted to redeem their daily reward within the same day. Pocari has stopped them! Yay!`);
			message.channel.send({embed});
		}
	
		fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
			if (err) console.log("> " + err);
		})

		return;

	}
	
	//Weather
	if (msg.startsWith(prefix + "WEATHER")) {
			console.log(`> ${sender.username} ran the command: weather`);

			weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
			if (err) console.log(err);

			//Just in case the location entered is inalid.
			if (typeof result === 'undefined') {
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
			let degreeUsed = '°C';
			parseInt(current.temperature);

			if (msg.startsWith(prefix + 'WEATHER_F')) {
				degreeUsed = '°F';
				alteredTemperature = current.temperature * (9 / 5) + 32;
				alteredFeelsLike = current.feelslike * (9 / 5) + 32;
			}
			if (msg.startsWith(prefix + 'WEATHER_K')) {
				degreeUsed = 'K';
				alteredTemperature = current.temperature * 1 + (273.15);
				alteredFeelsLike = current.feelslike * 1 + (273.15);
			}
			if (msg.startsWith(prefix + 'WEATHER_RE')) {
				degreeUsed = '°Ré';
				alteredTemperature = current.temperature * (5 / 4);
				alteredFeelsLike = current.feelslike * (5 / 4);
			}
			else if (msg.startsWith(prefix + 'WEATHER_C')) {
				degreeUsed = '°C';
				alteredTemperature = current.temperature;
				alteredFeelsLike = current.feelslike;
			}

			//Using a fancy schmancy embed for this. Classy, ma bois
			const embed = new Discord.RichEmbed()
				.setDescription(`**${current.skytext}**`) //Text of what the sky looks like {refer to weather-js npm page}
				.setAuthor(`Weather for ${current.observationpoint}`) //Shows the current location of weather (from weather-js observation point)
				.setThumbnail(current.imageUrl) //Sets the thumbnail of the embed
				.setColor(0x00AE86) //Sets colour of embed, can change later (hex value only, 0x infront)
				.addField('Timezone', timezonePlusMinus, true) //Adds field for timezone, uses earlier timezone variable
				.addField('Degree Type', degreeUsed, true) //Adds field to show the degree type, is 'inline'
				.addField('Temperature', alteredTemperature + `°`, true)
				.addField('Feels Like', alteredFeelsLike + `°`, true)
				.addField('Winds',current.winddisplay, true)
				.addField('Humidity', `${current.humidity}%`, true)

				//Now to display this embed when called
				message.channel.send({embed});

				//Don't run rest of script.
				return;

			})

		return;
	}

	//Command Handler
	try {

		let commandFile = require(`./commands/${cmd}.js`); //This will assign that filename to commandFile
		commandFile.run(client, message, args, func, prefix); //This will add the functions, from the functions.js file into each commandFile.

	} catch(e) { //If an error occurs, this will run

		console.log(`> `+ e.message);

	} finally { //This will run after the first two cleanup

		console.log(`> ${message.author.username} ran the command: ${cmd}`);

	}

	
});

//Client Login
client.login(tokens.bot_token);