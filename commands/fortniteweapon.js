const Discord = require('discord.js');
const fs = require('fs');
const fortniteWeaponStatsContents = fs.readFileSync('./Storage/fortnite_weapon_stats.json');
const fnws = JSON.parse(fortniteWeaponStatsContents);
const $ = require('jquery');

exports.run = (client, message, author, func) => {
    //Variables
    let prefix = '>';
    let weapon = '';
    let args = message.content.toUpperCase().slice(prefix.length).trim().split(" ");
    let listOfWeaponTypes = ['ASSAULTRIFLE', 'MINIGUN', 'SHOTGUN', 'HANDCANNON', 'PISTOL', 'REVOLVER', 'SUPPRESSEDPISTOL', 'SUBMACHINEGUN', 'SNIPERRIFLE', 'CROSSBOW', 'ZAPOTRON', 'LAUNCHER', 'PULLDATEVER'];
    let listOfSubtypes = ['BURST', 'M4', 'SCAR', 'SCOPED', 'PUMP', 'TACTICAL', 'REGULAR', 'SUPPRESSED', 'BOLT-ACTION', 'SEMI-AUTO', 'GRENADE', 'ROCKET'];
    let listOfRarity = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    let format = `${prefix}fortniteweapon <WeaponType> <Subtype> <Rarity> <Statistic>`;

    let SubtypeFound = ['BURST', 'M4', 'SCAR', 'SCOPED', 'PUMP', 'TACTICAL', 'REGULAR', 'SUPPRESSED', 'BOLT-ACTION', 'SEMI-AUTO', 'GRENADE', 'ROCKET'].indexOf(args[2]) >= 0;
    //>fortniteweapon <weapontype> [subtype e.g. burst] <rarity> <statistic>

    message.channel.send("**DEPRECATION WARNING: THE FOLLOWING INFORMATION IS OUT OF DATE.**");

    if (!['ASSAULTRIFLE', 'MINIGUN', 'SHOTGUN', 'HANDCANNON', 'PISTOL', 'REVOLVER', 'SUPPRESSEDPISTOL', 'SUBMACHINEGUN', 'SNIPERRIFLE', 'CROSSBOW', 'ZAPOTRON', 'LAUNCHER', 'PULLDATEVER'].includes(args[1])) {
        message.channel.send(`The selected Weapon Type: **${args[1]}** is nonexistent. Please use the following format: \`${format}\``);
        console.log(`> User ${message.author.username} has requested a nonexistent Weapon Type.`);
        return;
    }

    if (!listOfSubtypes.includes(args[2])) {
        message.channel.send(`The selected Subtype: **${args[2]}** is nonexistent. Please use the following format: \`${format}\``);
        console.log(`> User ${message.author.username} has requested a nonexistent Subtype.`);
        return;
    }

    if (!listOfRarity.includes(args[3])) {
        message.channel.send(`The selected Rarity: **${args[3]}** is nonexistent. Please use the following format: \`${format}\``);
        console.log(`> User ${message.author.username} has requested a nonexistent Rarity.`);
        return;
    }
    
    weapon = args[1];

    //Send Status
    message.channel.send(`Pocari is retreiving statistics for the ${args[3]} ${args[2]} ${args[1]}...`);
    console.log(`> ${message.author.username} has requested statistics for the ${args[3]} ${args[2]} ${args[1]}.`);

    //Make an embed
    let pathtoweaponinJSON = fnws[args[1]][args[2]][args[3]];
    const embed = new Discord.RichEmbed()
        .setTitle('**Fortnite Weapon Stats**')
        .setDescription(`**Statistics for ${weapon}**`)
        .setColor(0x800080)
        .setThumbnail(fnws[args[1]][args[2]].ICON)
        .addField("Weapon Type", args[1], true)
        .addField("Subtype", args[2], true)
        .addField("Rarity", args[3], true)
        .addField("\u200b", "\u200b", false)
        .addField("DPS", pathtoweaponinJSON.DPS, true)
        .addField("Damage", pathtoweaponinJSON.Damage, true)
        .addField("Environment Damage", pathtoweaponinJSON.EnvDamage, true)
        .addField("Fire Rate", pathtoweaponinJSON.FireRate, true)
        .addField("Magazine", pathtoweaponinJSON.Magazine, true)
        .addField("Reload Time", pathtoweaponinJSON.ReloadTime, true)
        .setFooter(`Pulled on ${fnws.PullDate}, from Fortnite ${fnws.PullVer}`)

    message.channel.send({embed});
    
    		
}