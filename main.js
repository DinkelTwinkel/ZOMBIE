// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token, mongourl } = require('./keys.json');
// const Visitor = require ('./models/visitors');
require('log-timestamp');

const cypherSpeak = require('./PATTERNS/cypherSpeak.js');
const debugAss = require('./secretCommands/debugAssignIdentity.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

client.once(Events.ClientReady, async c => {

  client.setMaxListeners(500);


  const mongoose = require('mongoose');

  await mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to HellDB'))
    .catch((err) => console.log(err));

	// eslint-disable-next-line no-mixed-spaces-and-tabs
	console.log(`Ready! Logged in as ${c.user.tag}`);
	client.user.setPresence({ status: 'dnd' });
	client.user.setActivity('OVERDRIVE', { type: ActivityType.Listening });

	const hellMart = client.guilds.cache.get('1022879808633454643');

	// auto register Commands);
	const registerCommands = require ('./registerCommands');
	registerCommands;

  const registerCommandsBackrooms = require ('./registerCommandsBackrooms');
	registerCommandsBackrooms;

  // await client.on(Events.GuildMemberAdd, async (member) => {

  //   console.log('New User Detected');

  //   const newVisitor = require('./PATTERNS/newVisitor.js');
  //   await newVisitor(member);

  // });

  // Elevator controller
  const Elevator = require('./PATTERNS/elevator');
  Elevator(client, hellMart);

  const BACKROOMS = client.guilds.cache.get('1166314538593959986');
  const backRoomControls = require('./PATTERNS/backRoomControls');
  backRoomControls(client, hellMart);

	// Regenerate Vending Machine
	const storageCategory = BACKROOMS.channels.cache.get('1166314625227300934');
	const vendingChannel = hellMart.channels.cache.get('1166286994557632562');

	const regenerateVendi = require('./PATTERNS/regenerateVending');
	regenerateVendi(BACKROOMS, storageCategory, vendingChannel, client);

	// detect AutoMinting
	const mint = require('./PATTERNS/Mint');
	mint (client, BACKROOMS, storageCategory, hellMart);

  // Generator for Signin Page and Listener for Sign In Clicks and Handler in general.
  const signIn = require('./PATTERNS/signIn');
  signIn(hellMart, client);

  // Intervaled Checks. For the reset Clock.

  setInterval(() => {
    const timeCheck = require('./PATTERNS/dailyResetGovernor');
    timeCheck(hellMart);
  }, 5000);

  // Activity Listener. To reset the decay of users.

  const listening = require('./PATTERNS/activityListener');
  listening(client);

  // auto updator for mart user count

  await hellMart.members.fetch();

  const counterChannel = hellMart.channels.cache.get('1166527027071950848');
  let membersWithRole = hellMart.members.cache.filter(member => member.roles.cache.has('1167076504434397246'));
  counterChannel.setName(`${membersWithRole.size} Shopping 🛒`);

  // Mart Counter.

  setInterval(() => {
    membersWithRole = hellMart.members.cache.filter(member => member.roles.cache.has('1167076504434397246'));
    counterChannel.setName(`${membersWithRole.size} Shopping 🛒`);
  }, (60 * 1000 * 5) + 1000);

  const temp = require('./TempCode');
  temp(client, hellMart);

  // Define a collection to store your commands
  client.commands = new Map();

  // Read the command files and register them
  const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
  });


    // Define a collection to store your commands
    client.commandsBACKROOMS = new Map();

    // Read the command files and register them
    const commandFilesBACKROOMS = fs.readdirSync('./commandsBackRooms').filter((file) => file.endsWith('.js'));

    for (const file of commandFilesBACKROOMS) {
      const commandBACKROOMS = require(`./commandsBackRooms/${file}`);
      client.commandsBACKROOMS.set(commandBACKROOMS.data.name, commandBACKROOMS);
    }

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      const commandBACKROOMS = client.commandsBACKROOMS.get(commandName);

      if (!commandBACKROOMS) return;

      try {
        await commandBACKROOMS.execute(interaction, client);
      }
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
      }
    });

});


client.on(Events.GuildMemberRemove, async (member) => {

	console.log('User Exit Detected, cleaning up-');

	const annihilate = require('./PATTERNS/userAnnihilation');
	annihilate(member);
});

// Regular Secret Commands
client.on(Events.MessageCreate, async (message) => {
	if (message.content.startsWith('!')) {
		console.log('Command Detected');
		// Extract the command and any arguments
		const args = message.content.slice(1).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		// Check the command and respond
		if (command === 'ping') {
			cypherSpeak('pong...', message.channel, 200, 1);
		}
		else if (command === 'hello') {
			cypherSpeak('Greetings', message.channel, 200, 1);
		}
		// Add more commands here as needed
	}
});

// Admin Secret Commands
client.on(Events.MessageCreate, async (message) => {
	if (message.author.id != '865147754358767627') return;
	if (message.content.startsWith('!')) {
		console.log('Secret Command Detected');
		// Extract the command and any arguments
		const args = message.content.slice(1).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		// Check the command and respond
		if (command === 'paw') {
			cypherSpeak('# WOOF!', message.channel, 200, 1);
		}
		else if (command === 'fixrecords') {
			message.channel.send('FixingRecords');
			await debugAss(message.guild);
			message.channel.send('Complete');
		}
		// Add more commands here as needed
	}
});

// Log in to Discord with your client's token
client.login(token);