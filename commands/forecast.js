const Discord = require('discord.js');
const weather = require('weather-js');

exports.run = async (client, message, args, func) => {

    //Query weather data
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
        var forecast = result[0].forecast;  //Variable for forecast

        var timezonePlusMinus = (location.timezone > 0) ? `UTC +${location.timezone}` : `UTC ${location.timezone}`;


        //Embed
        const embed = new Discord.RichEmbed()
            .setAuthor(`Forecast for ${current.observationpoint}`) //Shows the current location of weather (from weather-js observation point)
            .setColor(0x00AE86) //Sets colour of embed, can change later (hex value only, 0x infront))
            .addField('Timezone', timezonePlusMinus, true) //Adds field for timezone, uses earlier timezone variable
            .addBlankField()
            .setFooter(`Showing Weather Data for ${current.observationpoint}, next ${forecast.length} days`)
            .setTimestamp()

        for (j in forecast) {
            if (forecast[j].precip === "") forecast[j].precip = 0;

            embed.addField(`${forecast[j].day}, ${forecast[j].date}`, `**${forecast[j].skytextday}** with the low at **${forecast[j].low}** and high at **${forecast[j].high}** degrees. Precipitation chance is **${forecast[j].precip}%**`)
            
            if (j < forecast.length) {embed.addBlankField()}
        }

        message.channel.send(embed);
    })


}