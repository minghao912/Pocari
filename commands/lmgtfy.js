const encode = require('strict-uri-encode');

exports.run = (client, message, args, tools) => {

    let question = encode(args.join(' '));  //Combine by space, then encode so it can turn into a URL

    //Form the link
    let link = `https://www.lmgtfy.com/?q=${question}`; //This is the lmgtfy URL format, adding the encoded 'question'

    //Output
    message.channel.send(`**<${link}>**`);

}