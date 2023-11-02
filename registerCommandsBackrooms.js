const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./keys.json'); // Create a config.json file to store your client ID and token
const fs = require('fs');

const commandsBACKROOMS = [];
const commandFilesBACKROOMS = fs.readdirSync('./commandsBackRooms').filter(file => file.endsWith('.js'));

for (const file of commandFilesBACKROOMS) {
  const commandBACKROOMS = require(`./commandsBackRooms/${file}`);
  commandsBACKROOMS.push(commandBACKROOMS.data);
}

console.log(commandsBACKROOMS);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      // If you want to register commands globally, use the following line:
      // Routes.applicationCommands(clientId),

      // If you want to register commands for a specific guild, use the following line:
      Routes.applicationGuildCommands(clientId, '1166314538593959986'),
      { body: commandsBACKROOMS },
    );

    console.log(`Successfully reloaded ${commandsBACKROOMS.length} application (/) commands.`);
  }
  catch (error) {
    console.error(error);
  }
})();