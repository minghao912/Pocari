const Discord = require('discord.js');
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('./Storage/tokens.json'));
const request = require('request');

exports.run = (client, message, args, func, prefix, tokens) => {
    
    //Server Stats Manager
	//Vars
	let oldNumOfOnlineUsers;
	let newNumOfOnlineUsers;

	//Total Number of Users in a Server
	function retreiveTotalUsers () {
		//Vars
		let serverID = client.guilds.get(message.guild.id);

		//Number of Users in a Server
		return serverID.members.size;
	}

	function updateTotalUsers (TotalUsers) {
		//Edit name of channel if the Number of Users has changed.
		client.channels.get("426411802713128960").setName(`Total Users: ${TotalUsers}`).catch(console.error);

		console.log(`> Total Users Updated! There are ${TotalUsers} total user(s) in ${message.guild.name}.`);
	}

	let numOfUsers = retreiveTotalUsers();
	updateTotalUsers(numOfUsers);

	//Number of Online Users in a Server
	//Function to Update the Channel
	function updateOnlineUsers (OnlineUsers) {

		client.channels.get("426411909697372160").setName(`Online Users: ${OnlineUsers}`)	//Edit Voice Channel to reflect # of online users
			.catch(console.error);

		let areis;
		if (OnlineUsers == 1) {
			areis = "is";
		} else {areis = "are";}

		return console.log(`> Online Users updated! There ${areis} currently ${OnlineUsers} user(s) online in ${message.guild.name}.`);
	}	

	function updateOnlineBots (OnlineBots, BotUsernameList) {

		client.channels.get("434391786987978752").setName(`Online Bots: ${OnlineBots}`)	//Edit Voice Channel to reflect # of online bots
			.catch(console.error);

		console.log(`> There are ${OnlineBots} bot(s) in ${message.guild.name}: ${BotUsernameList}`);

	}
	
	//Use Discord's Widget JSON
	request('https://discordapp.com/api/guilds/150870566826541056/embed.json', function (error, response, body) {
		
		//Declare var with bigger scope
		let numOfOnlineUsers2;

		//If there is no error, and successful retreival
		if (!error && response.statusCode == 200) {

			var importJSON_obj = JSON.parse(body);	//Parse the JSON from string to object
			let numOfOnlineUsers1 = importJSON_obj.members.length;	//Find the number of Online Users

			let arrayOfBots = [];
			let numOfBots;

			//Determine # of bots
			for (i = 0; i <= numOfOnlineUsers1 - 1; i++) {

				if (importJSON_obj.members[i].bot == true) {	//Add 1 to the # of bots if it detects that the online user is a bot
					arrayOfBots.push(importJSON_obj.members[i].username);
				}
				
				numOfBots = arrayOfBots.length;
				numOfOnlineUsers2 = numOfOnlineUsers1 - numOfBots;	//Subtract # of bots from total

			}

			let listOfBotUsernames = arrayOfBots.toString().split(",").join(", ");
			updateOnlineBots(numOfBots, listOfBotUsernames);
			
			oldNumOfOnlineUsers = numOfOnlineUsers2;	//Puts the number of online users into a larger variable (for acccess by interval function)
			updateOnlineUsers(numOfOnlineUsers2);		//Update the voice channel with the correct #

		}
	})
			
	//After initial run, do it every 5 seconds; If there is change, adapt accordingly
	setInterval( function() {

		request('https://discordapp.com/api/guilds/150870566826541056/embed.json', function (error, response, body) {

			//If there is no error, and successful retreival
			if (!error && response.statusCode == 200) {

				var importJSON_obj = JSON.parse(body);	//Parse the JSON from string to object
				let numOfOnlineUsers3 = importJSON_obj.members.length;	//Find the number of Online Users
				let arrayOfBotUsernames = [];	//Have an empty array of Bot Usernames
				let numOfBots2;

				//Determine # of bots
				for (q = 0; q <= numOfOnlineUsers3 - 1; q++) {

					if (importJSON_obj.members[q].bot == true) {	//Add the username of a bot to the array if the user is a bot
						arrayOfBotUsernames.push(importJSON_obj.members[q].username);
					}
					
					//Subtract the number of bots (the length of the array) from total users.
					numOfBots2 = arrayOfBotUsernames.length;	
					newNumOfOnlineUsers = numOfOnlineUsers3 - numOfBots2;
	
				}
				
				//If there has been a difference between old and new #, update the voice channel accordingly
				//Find Channel Name, Extract Number
				let Channel = client.channels.get("426411909697372160");
				let ChannelName = Channel.name;
				let currentChannelArray = Channel.name.split(" ");
				let currentChannelNum = currentChannelArray[2];

				//If difference, do stuff
				if (newNumOfOnlineUsers != currentChannelNum) {
					updateOnlineUsers(newNumOfOnlineUsers);	//Update the channel name

					let listOfBotUsernames2 = arrayOfBotUsernames.toString().split(",").join(", ");	//Update console with number of bots.
					updateOnlineBots(numOfBots2, listOfBotUsernames2);
				}
			}
		})
				
	}, 5000)

	setInterval(async function () {
		
		//Check if Number of Users has changed.
		let newNumOfUsers = retreiveTotalUsers();

		if (newNumOfUsers != numOfUsers) {
			updateTotalUsers(newNumOfUsers);
		}

    } , 5000);
    
}