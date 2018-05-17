exports.run = (client, message, args, func) => {

	func.shutdown(message.channel);

}