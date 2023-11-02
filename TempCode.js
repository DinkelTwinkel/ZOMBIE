// const Location = require('./models/location');
// // const Race = require('./models/race');
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow } = require('discord.js');
const Time = require('./models/time');
const Visitor = require('./models/visitors');

module.exports = async (client, hellMart) => {
// temp code

// const existingNumbers = await Visitor.distinct('number');
// const allNumbers = Array.from({ length: 100 + 1 }, (_, i) => i);
// const availableNumbers = allNumbers.filter((number) => !existingNumbers.includes(number));

// console.log (availableNumbers);


    // const now = new Date();
    // console.log (now.getDate());

    // const filter = {}; // An empty filter matches all documents
    // const update = {
    //   $set: { dailyFortune: 'try' },
    // };

    // const updateResult = await Time.updateMany(filter, update);
    // console.log(`Matched ${updateResult.matchedCount} documents and modified ${updateResult.modifiedCount} documents.`);

};
    // make a button on the backrooms end to add or remove admin role.
    // const backrooms = client.guilds.cache.get('1166314538593959986');
    // const badMinButtonsChannel = backrooms.channels.cache.get('1167800873267773450');

    // const badMintOverrideButton = new ButtonBuilder()
    // .setCustomId('badminOverride')
    // .setStyle(ButtonStyle.Danger)
    // .setLabel('BADMIN'),

    // const new ActionRow

    // badMinButtonsChannel.send('')

    // console.log(client);

    // const filter = {}; // An empty filter matches all documents
    // const update = {
    //   $set: { dynamic: false },
    // };

    // const updateResult = await Location.updateMany(filter, update);
    // console.log(`Matched ${updateResult.matchedCount} documents and modified ${updateResult.modifiedCount} documents.`);

// };

    // Elevator Channel, find all roles. Set to see but not write.

//     const elevator = hellMart.channels.cache.get('1166319930774401034');

//     const roles = await hellMart.roles.fetch();

//     roles.forEach((role) => {
//         elevator.permissionOverwrites.edit(role, {
//             SendMessages: false,
//             ViewChannel: true,
//         });
//     });


    // const members = await hellMart.members.fetch();

    // members.forEach((member) => {
    //     if (!member.roles.cache.get('1167076504434397246')) {
    //         if (member.user.bot) return;
    //         member.roles.set([]);
    //     }
    // });

    // const filter = {}; // An empty filter matches all documents
    // const update = {
    //   $set: { password: 'false' },
    // };

    // const updateResult = await Location.updateMany(filter, update);
    // console.log(`Matched ${updateResult.matchedCount} documents and modified ${updateResult.modifiedCount} documents.`);

    // const newRace = new Race ({
    //     raceName: 'ghost',
    //     raceRoleID: '1166092873389850624',
    //     raceDescription: 'a haunting sight',
    //     raceMaxLife: 3,
    //     baseStrength: 1,

    //     skills: [],
    //     nextEvolutionOptions: ['ghoul', 'poltergeist', 'zombie'],
    //     nextEvolutionXPrequirement: 100,
    //     nextEvolutionRequireditems: [],

    // });

    // await newRace.save();

    // client.on(Events.InteractionCreate, async (interaction) => {

	// 	if (!interaction.isButton()) return;
    //     if (interaction.customId === 'ascend') {

    //         if (interaction.member.roles.cache.has('1167076504434397246')) {
    //             interaction.member.roles.set(['1167174879402004490']);
    //         }
    //         else {
    //             interaction.member.roles.set(['1167076504434397246']);
    //         }

    //         interaction.reply ({ content: 'ascended', ephemeral: true });

    //     }
    //     else if (interaction.customId === 'descend') {

    //         if (interaction.member.roles.cache.has('1167174879402004490')) {
    //             interaction.member.roles.set(['1167076504434397246']);
    //         }
    //         else {
    //             interaction.member.roles.set(['1167167488757342248']);
    //         }
    //         interaction.reply ({ content: 'descended', ephemeral: true });
    //     }

    // });

    // const ascendButton = new ButtonBuilder()
    // .setLabel('ASCEND')
    // .setCustomId('ascend')
    // .setStyle(ButtonStyle.Secondary);

    // const descendButton = new ButtonBuilder()
    // .setLabel('DESCEND')
    // .setCustomId('descend')
    // .setStyle(ButtonStyle.Secondary);

    // const basementActionRow = new ActionRowBuilder ()
    // .setComponents(ascendButton);
    // const elevatorActionRow = new ActionRowBuilder ()
    // .setComponents(descendButton);

    // const basementChannel = hellMart.channels.cache.get('1166320062853025844');
    // const elevatorChannel = hellMart.channels.cache.get('1166319930774401034');

    // basementChannel.send({ components: [basementActionRow] });
    // elevatorChannel.send({ components: [elevatorActionRow] });

    // const hellMart = new Location({
    //     floor: 0,
    //     locationName: 'Hell Mart',
    //     locationChannelIDs: ['1166286667791999037', '1165473312265216080', '1165623475826864208', '1166526094757867590'],
    //     locationAccessRoleID: '1167076504434397246',
    // });

    // await hellMart.save();

    // const updateResult = await Visitor.updateMany({}, {
    //     $setOnInsert: { currentLocation: '1167076353502363679' },
    //   }, {
    //     upsert: true,
    //   });
    //   console.log(`Matched ${updateResult.matchedCount} documents, modified ${updateResult.modifiedCount} documents, and inserted ${updateResult.upsertedCount} documents.`);