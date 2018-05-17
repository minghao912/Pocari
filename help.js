if (msg.startsWith(prefix + 'HELP')) { //Using sperate JSON file

		//Check if only command was =HELP
		if (msg === `${prefix}HELP`) { //Only showing commands for regular users.

			//Start embed
			const embed = new Discord.RichEmbed()
				.setColor(0x1D82B6)

			//Variables
			let commandsFound = 0; //Telling how many commands there are for the specific group

			//Create loop to loop through commands
			for (var cmd in commands) {

				//Checks if the group is 'Users'
				if (commands[cmd].group.toUpperCase() === 'USER') {
					//Add a commandsFound + 1 every time it finds a command in the group
					commandsFound++

					//Add command field to the embed
					embed.addField(`***${commands[cmd].name}***`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`); //Output
				}

				
			}

			//Add some more to the embed
				embed.setFooter(`Currently showing user commands. To view another group, use ${prefix}help [group / command]`);
				embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional.`);

			//Output it two ways: 1 - Send to DMs, or Post in chat.
			message.channel.send({embed});

		} else {
			//Help [command/group] programming

			//Variables
			let groupFound = '';

			for (var cmd in commands) { //Check if there's a group named what user entered

				if (args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
					groupFound = commands[cmd].group.toUpperCase(); //Set the ground found, then break out of the loop
					break;
				}
			}

			if (groupFound != '') { //If group is found run this function

				//Start embed
				const embed = new Discord.RichEmbed()
					.setColor(0x1D82B6)

				//Variables
				let commandsFound = 0; //Telling how many commands there are for the specific group

				for (var cmd in commands) {

					//Checks if the group is 'Users'
					if (commands[cmd].group.toUpperCase() === groupFound) {
						
						//Add a commandsFound + 1 every time it finds a command in the group
						commandsFound++

						//Add command field to the embed
						embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`); //Output
					}

				}

				//Add some more to the embed
				embed.setFooter(`Currently showing ${groupfound} commands. To view another group, use ${prefix}help [group / command]`);
				embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional.`);

				//Output it two ways: 1 - Send to DMs, or Post in chat. (Posting in chat)
				message.channel.send({embed});

				return; //So it doesn't run the rest of the script

			}
		}
