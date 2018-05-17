const Discord = require('discord.js');
const moment = require('moment');

exports.run = async (client, message, author, args) => {

    message.channel.send('**Starting User Count**')
    var Count;
    var arrayofUsers = [];

    //Count number of users, put usernames into array
    for (Count in client.users.array()) {
        var User = client.users.array()[Count]; //Count the number of users
        await arrayofUsers.push(User.username);  //Add the username to an array
    }
    
    //We don't want markdown in this list
    function checkMarkdown() {
        //Define an array of markdown characters
        let arrayOfMarkdown = ['--', '*', '_'];

        //For every element in the username array,
        for (p in arrayofUsers) {
                
            function checkMarkdown2() {
                for (char in arrayOfMarkdown) { //For every element in the markdown array,
                        
                    //Check if the username is between the same markdown character
                    if (arrayofUsers[p].startsWith(arrayOfMarkdown[char]) && arrayofUsers[p].endsWith(arrayOfMarkdown[char])) {
                        return newElement = "\\" + arrayofUsers[p]; //If so, return the function whilst adding a backslash to cancel the markdown
                    } else {newElement = arrayofUsers[p];} //If not, just keep it as is
                }
            }

            checkMarkdown2();

            //Replace all values of the user array with the new elements
            arrayofUsers[p] = newElement;
        }
    }

    //Check the usernames for any markdown notation
    checkMarkdown();

    //Alphabetically sort the array (case insensitive)
    await arrayofUsers.sort(function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a == b) return 0;
        return a < b ? -1 : 1;
    })

    //Get time and date
    let momentUTC = moment.utc().format("dddd, Do MMMM YYYY, HH:mm:ss") + " UTC";

    //Send a message for every user
    for (i in arrayofUsers) {
        let countNumber = (i * 1) + 1;

        await message.channel.send(`${countNumber} ${arrayofUsers[i]}`);
    }
    
    //Send pull date
    await message.channel.send(`**Count Completed! This data was pulled ${momentUTC}**`)

}