module.exports = {

	on: function (channel) {

		channel.send("Ya thirsty?");

	},

	shutdown: function (channel) {

		channel.send("Pocari's out of juice, ma boi!");
		console.log("> Powering Off...");
		channel.send("Pocari out!");
		console.log("> Pocari out!");
		function Exit_Process() {
			process.exit(0); //This is a crude exit, but it'll do (until I can find a cleaner way THAT ACTUALLY WORKS)
		}
		setTimeout(Exit_Process, 3000);
		
	},
	
	//Random Number Generator (Inclusive)
	randomNumGenInc: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	//Random Number Generator (Exclusive)
	randomNumGenExc: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1));
	},

	//Alphabetisise an array, (case insensitive)
	alphaArrayInsensitive: function (array) {
		array.sort(function(a, b) {
			a = a.toLowerCase();
			b = b.toLowerCase();
			if (a == b) return 0;
			return a < b ? -1 : 1;
		})
	}
}