const { ButtonBuilder, ButtonStyle, Events, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const Visitor = require ('../models/visitors');
const Location = require ('../models/location');

const roleSetter = require('./roleSet');

const mainImage = 'https://cdn.discordapp.com/attachments/1166362435947606068/1167237836089593956/maks-kozlow-untitled.jpg?ex=654d65f2&is=653af0f2&hm=97cd1d53e0a8a438e03b226b4a4ff082d5c8fcee932a1933a9c3b339cbb2e6ed&';

module.exports = async (client, hellMart) => {

    // clean channel

    console.log ('elevator system loaded');
    const elevator = await hellMart.channels.cache.get('1166319930774401034');
    const messages = await elevator.messages.fetch();
	elevator.bulkDelete(messages);

    strangeButtonRow (elevator);


    // create initial interface

    const enterElevatorButton = new ButtonBuilder ()
    .setCustomId('enterElevator')
    .setLabel('『 ENTER 』')
    .setStyle(ButtonStyle.Success)
    .setDisabled(false);

    const cowerElevatorButton = new ButtonBuilder ()
    .setCustomId('cowerElevator')
    .setLabel('cowercowercowercower')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

    const entryRow = new ActionRowBuilder ()
    .setComponents(enterElevatorButton, cowerElevatorButton);

    const embed = new EmbedBuilder()
    .setAuthor({
        name: 'Elevator Status: Floors -1 to 1000 available',
        iconURL: 'https://cdn.discordapp.com/attachments/1166362435947606068/1167257643849621524/ezgif.com-resize_3.gif?ex=654d7864&is=653b0364&hm=6b2d14de786c1e38759cef9db47b55ab86393ef903d3c650370ae241f6ca876e&',
      });
    // .setThumbnail('https://cdn.discordapp.com/attachments/1166362435947606068/1167257643849621524/ezgif.com-resize_3.gif?ex=654d7864&is=653b0364&hm=6b2d14de786c1e38759cef9db47b55ab86393ef903d3c650370ae241f6ca876e&');
    // .setImage('https://cdn.discordapp.com/attachments/1166362435947606068/1167248294821498920/image.png?ex=654d6faf&is=653afaaf&hm=c610b718942d3dcb77a104ec9365614bcd8f3bb1137b009627ab695e5876d28f&');

    const upperCap = 1000;
    const lowerCap = -1;

    // await elevator.send({ components: [elevatorTopDecorRow] });

    await elevator.send({ components: [entryRow], files: [{ attachment: mainImage }], embeds: [embed] });

    // listener for up or down

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'enterElevator') {

            // enter elevator do a check for if previous location is dynamic. If yes, Do a check for how many users still have the role.
            // If no users still have role then delete role + channels via the ids.

            const uniqueRequestAssignment = Date.now() + interaction.member.user.id;
            await roleSetter(interaction.member, '1167260879566426204');

            dynamicChanneCleanup (interaction, hellMart);


            const zeroButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 0`)
            .setLabel('0')
            .setStyle(ButtonStyle.Secondary);

            const oneButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 1`)
            .setLabel('1')
            .setStyle(ButtonStyle.Secondary);

            const twoButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 2`)
            .setLabel('2')
            .setStyle(ButtonStyle.Secondary);

            const threeButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 3`)
            .setLabel('3')
            .setStyle(ButtonStyle.Secondary);

            const fourButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 4`)
            .setLabel('4')
            .setStyle(ButtonStyle.Secondary);

            const fiveButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 5`)
            .setLabel('5')
            .setStyle(ButtonStyle.Secondary);

            const sixButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 6`)
            .setLabel('6')
            .setStyle(ButtonStyle.Secondary);

            const sevenButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 7`)
            .setLabel('7')
            .setStyle(ButtonStyle.Secondary);

            const eightButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 8`)
            .setLabel('8')
            .setStyle(ButtonStyle.Secondary);

            const nineButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} 9`)
            .setLabel('9')
            .setStyle(ButtonStyle.Secondary);

            const minusButton = new ButtonBuilder ()
            .setCustomId(`elevator${uniqueRequestAssignment} -`)
            .setLabel('-')
            .setStyle(ButtonStyle.Secondary);

            const clear = new ButtonBuilder ()
            .setCustomId(`Clear${uniqueRequestAssignment}`)
            .setLabel('C')
            .setStyle(ButtonStyle.Primary);

            const go = new ButtonBuilder ()
            .setCustomId(`GO${uniqueRequestAssignment}`)
            .setLabel('GO')
            .setStyle(ButtonStyle.Success);

            const exit = new ButtonBuilder ()
            .setCustomId(`Exit${uniqueRequestAssignment}`)
            .setLabel('EXIT')
            .setStyle(ButtonStyle.Danger);

            const jumpArt = new ButtonBuilder ()
            .setCustomId(`jumpArt${uniqueRequestAssignment}`)
            .setLabel('⏫: ART')
            .setStyle(ButtonStyle.Primary);

            const jumpHellMart = new ButtonBuilder ()
            .setCustomId(`jumpHellMart${uniqueRequestAssignment}`)
            .setLabel('⏬JUMPTO: HELL MART')
            .setStyle(ButtonStyle.Primary);

            const elevatorRow1 = new ActionRowBuilder()
            .addComponents(oneButton, twoButton, threeButton, clear);

            const elevatorRow2 = new ActionRowBuilder()
            .addComponents(fourButton, fiveButton, sixButton, minusButton);

            const elevatorRow3 = new ActionRowBuilder()
            .addComponents(sevenButton, eightButton, nineButton, jumpArt);

            const elevatorRow4 = new ActionRowBuilder()
            .addComponents(go, zeroButton, exit, jumpHellMart);

            const numberPad = await interaction.reply ({ content: '`Please Enter Floor Number`', components: [elevatorRow1, elevatorRow2, elevatorRow3, elevatorRow4], ephemeral: true });

            setTimeout(() => {
                numberPad.delete();
            }, 30000);


            client.on(Events.InteractionCreate, async (i) => {
                    if (!i.isButton()) return;

                    // check if entered starts with elevatorand custom ID, if so, find the last character.

                    if (i.customId.startsWith(`jumpArt${uniqueRequestAssignment}`)) {
                        const visitor = await Visitor.findOne({ userID: i.user.id });
                        visitor.currentLocation = 1;
                        await visitor.save();
                        roleSetter(i.member);
                        await i.deferUpdate();
                        interaction.editReply('`' + '[Arrived at Sweatshop]' + '`');
                    }

                    if (i.customId.startsWith(`jumpHellMart${uniqueRequestAssignment}`)) {
                        const visitor = await Visitor.findOne({ userID: i.user.id });
                        visitor.currentLocation = 0;
                        await visitor.save();
                        roleSetter(i.member);
                        await i.deferUpdate();
                        interaction.editReply('`' + '[Arrived at Hell Mart]' + '`');
                    }


                    if (i.customId.startsWith(`elevator${uniqueRequestAssignment}`)) {

                        console.log(i.customId);
                        console.log (i.customId.split(' '));

                        const charactersToRemove = '`'; // Replace with the characters you want to remove
                        let modifiedString;

                        console.log (i.message.content);

                        const arrivedAtTextCheck = i.message.content.split(' ');

                        // console.log(arrivedAtTextCheck[1]);
                        // console.log('at');
                        // if (arrivedAtTextCheck[1] == 'at') console.log ('matching');

                        console.log (i.message.content);

                        if (i.message.content === '`Please Enter Floor Number`') {
                            modifiedString = '';
                        }
                        else if (arrivedAtTextCheck[1] === 'at' || arrivedAtTextCheck[1] === 'selection') {
                            modifiedString = '';
                        }
                        else {
                            modifiedString = i.message.content.replace(new RegExp(`[${charactersToRemove}]`, 'g'), '');
                        }

                        const newMessage = '`' + modifiedString + i.customId.split(' ')[1] + '`';
                        interaction.editReply({ content: newMessage });

                        const clicks = ['click', 'CLICK', '*click*'];
                        let click = clicks[Math.floor(Math.random() * clicks.length)];
                        if (Math.random() < 0.2) {
                            const altClicks = ['moan', 'meow', 'scream', 'help me', 'run', 'RUN', 'mom?', 'i love u', 'I\'m scared'];
                            click = altClicks[Math.floor(Math.random() * altClicks.length)];
                        }

                        await i.reply({ content: click, ephemeral: false }).then((msg) => {
                            setTimeout(() => {
                                msg.delete();
                            }, 100);
                        });
                    }

                    if (i.customId === `Clear${uniqueRequestAssignment}`) {
                        // clear numbers and add [enter floor number]
                        interaction.editReply({ content: '`Please Enter Floor Number`' });
                        await i.deferUpdate();
                    }

                    if (i.customId === `GO${uniqueRequestAssignment}`) {
                        // Travel to Selected Floor Search for Floor Entry on LOCATION, if it doesn't exist then create one and the role to access it with
                        const charactersToRemove = '`'; // Replace with the characters you want to remove
                        const modifiedString = i.message.content.replace(new RegExp(`[${charactersToRemove}]`, 'g'), '');
                        const floorSelection = parseInt(modifiedString);
                        await i.deferUpdate();

                        if (lowerCap <= floorSelection && floorSelection <= upperCap) {

                                    let location = await Location.findOne({ floor: floorSelection });

                                    if (!location) {

                                        // generating new location record

                                        let voiceTextTypeDB = 'text';
                                        if (Math.random() < 0.5) {
                                            voiceTextTypeDB = 'voice';
                                        }

                                        const generateName = require('./generateName');
                                        const channelName = await generateName('Room', floorSelection);

                                        location = new Location ({
                                            floor: floorSelection,
                                            locationName: channelName,
                                            requireKey: false,
                                            requirePassword: false,
                                            password: 'null',
                                            dynamic: 'true',
                                            locationAccessRoleID: Math.random(),
                                            dynamicChannels: [
                                                {
                                                channelName: channelName,
                                                type: voiceTextTypeDB,
                                                parent: '1167314062942675035',
                                                description: channelName,
                                                },
                                                {
                                                channelName: 'Floor ' + floorSelection,
                                                type: 'category',
                                                parent: '1167314062942675035',
                                                description: channelName,
                                                },
                                            ],
                                            dynamicRoleName: 'F' + floorSelection,
                                            active: false,
                                        });

                                        console.log(location);
                                        await location.save();
                                    }

                                    const visitor = await Visitor.findOne({ userID: interaction.user.id });
                                    visitor.currentLocation = location.floor;
                                    await visitor.save();

                                    await interaction.editReply('`' + `[Arrived at ${location.locationName}]` + '`');
                        }
                        else {
                            await interaction.editReply('`[floor selection out of range]`');
                        }


                    }


                if (i.customId === `Exit${uniqueRequestAssignment}`) {
                    // find location record via users current position.

                    console.log ('Exiting...');

                    const visitor = await Visitor.findOne ({ userID: i.user.id });
                    const location = await Location.findOne ({ floor: visitor.currentLocation });
                    await i.deferUpdate();

                    // check if location is dynamic && active = false then generate new channels and overwrite old records. If

                    // console.log ('Checking for Dynamic and Switched off');

                    if (location.dynamic === true && location.active === false) {
                        // Generate new channels and role and then apply to both user and database.

                        console.log ('Inactive Dynamic Room found');

                        // clears channel IDS since we are making new ones.

                        location.locationChannelIDs = [];
                        location.locationAccessRoleID = '';

                        console.log ('ChannelIDs Cleaned');

                        // create role.

                        console.log('role name: ' + location.dynamicRoleName);

                        const newRole = await hellMart.roles.create({ name: location.dynamicRoleName });
                        i.channel.permissionOverwrites.create (newRole, { ViewChannel: true, SendMessages: false });

                        location.locationAccessRoleID = newRole.id;

                        console.log ('New Role Created');

                        // obtains a collection of all the channel information we must make.

                        const channelsToGenerate = location.dynamicChannels;

                        let categoryChannelRecord;

                        channelsToGenerate.forEach ((channel) => {
                            // find channel. Find, then Make
                            if (channel.type === 'category') {
                                // selects channnle
                                categoryChannelRecord = channel;
                            }
                        });

                        console.log ('Category BluePrint Found');

                        // generate category channel

                        const newCategory = await hellMart.channels.create({
                            name: categoryChannelRecord.channelName,
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                },
                                {
                                    id: newRole,
                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                },
                            ],
                        });

                        console.log ('New Category Created: ' + newCategory.name);
                        location.locationChannelIDs.push(newCategory.id);

                        // make the rest of the channels but attach to category and skip previous.

                        channelsToGenerate.forEach ((channel) => {

                            if (channel.type != 'category') {
                                let channelType = ChannelType.GuildText;
                                if (channel.type === 'voice') {
                                    channelType = ChannelType.GuildVoice;
                                }

                                // create channel.
                                createChannel(hellMart, channel, channelType, newCategory, location);

                            }

                        });

                        // sets it to active so it doesn't attempt to generate again.

                        location.active = true;
                        await location.save();
                    }

                    visitor.currentLocation = location.floor;
                    await visitor.save();
                    roleSetter(i.member);

                    interaction.deleteReply();
                }
            });

        }
    });

    // get visitor card to find current location.
    // Use location to find entry in Location database
    // Find the next level up or down.

};

async function createChannel(hellMart, channel, channelType, newCategory, location) {

    const newChannel = await hellMart.channels.create({
        name: channel.channelName,
        type: channelType,
        parent: newCategory,
    });

    console.log ('New Category Created: ' + newCategory.name);
    location.locationChannelIDs.push(newChannel.id);

    console.log ('New Channel Created: ' + newChannel.name);

}

async function dynamicChanneCleanup(interaction, hellMart) {

    const userInfo = await Visitor.findOne({ userID: interaction.member.user.id });
    const location = await Location.findOne({ floor: userInfo.currentLocation });

    // if location is a dynamic one, then contine check

    if (location.dynamic === false || location.active === false) return;

    // now check users with the role left. E.G fetch all members and then get roles count.

    // await hellMart.members.cache();

    const dynamicRole = hellMart.roles.cache.get(location.locationAccessRoleID);

    if (!dynamicRole) return;
    const membersWithRole = hellMart.members.cache.filter(member => member.roles.cache.has(dynamicRole.id));

    if (membersWithRole.size <= 0) {
        // TIME TO CLEAN = DELETE ROLE AND DELETE CHANNELS AND SET TO INACTIVE AND CLEAN LOCATION CHANNEL IDS.
        location.active = false;
        await location.save();
        dynamicRole.delete();
        location.locationChannelIDs.forEach((id) => {
            hellMart.channels.cache.get(id).delete();
        });
    }
}

async function strangeButtonRow(channel) {

   //  need both sets of strings
    // need a loop statement x 5
    // randomize the changing of each by time outs.

    let strangeRow = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
            .setLabel('strange')
            .setCustomId('strangetemp')
            .setStyle(ButtonStyle.Secondary),
    );

    const strangeMessage = await channel.send({ components: [strangeRow] });

    const buttons = [];

    for (let index = 0; index < 5; index++) {

        const button = new ButtonBuilder ()
        .setCustomId('topBarButton' + index)
        .setStyle(ButtonStyle.Secondary)
        .setLabel('𝐇A')
        .setDisabled(true);

        buttons.push(button);
    }

    setInterval(() => {

        const bigChars = ['𝐇', '🄴', '𝐋', '🅴', '𝕃', '🅷', '𝑬', '🄻', '𝐄', '🅻', '𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗', '𝟎'];
        const smallChars = '⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉ₐₑₒₓₔₕₖₗₘₙₚₛₜⁿi';


        strangeRow = new ActionRowBuilder ();

        // shift the button letters

        for (let index = 0; index < 5; index++) {

            const letter1 = smallChars.charAt(Math.floor(Math.random() * smallChars.length));
            let letter2 = bigChars[Math.floor(Math.random() * bigChars.length)];
            const letter3 = smallChars.charAt(Math.floor(Math.random() * smallChars.length));

            if (Math.random() < 0.3) {
                letter2 = letter2.concat(bigChars[Math.floor(Math.random() * bigChars.length)]);
            }

            // console.log(letter1, letter2, letter3);
            // console.log(Math.sin(index));

            if (Math.sin(Math.random() * index) < 0.3) {

                buttons[index]
                    .setCustomId('topBarButton' + index)
                    .setLabel(letter1 + letter2 + letter3)
                    .setDisabled(true);

            }

            const randomWORDs = ['help', 'run', '¿up?', '¿down?', '¿die?', 'HA𝐇'];

            if (Math.random() < 0.01) {
                buttons[0].setLabel(randomWORDs[Math.floor(Math.random() * randomWORDs.length)]);
                buttons[1].setLabel(randomWORDs[Math.floor(Math.random() * randomWORDs.length)]);
                buttons[2].setLabel(randomWORDs[Math.floor(Math.random() * randomWORDs.length)]);
                buttons[3].setLabel(randomWORDs[Math.floor(Math.random() * randomWORDs.length)]);
                buttons[4].setLabel(randomWORDs[Math.floor(Math.random() * randomWORDs.length)]);
            }
            else if (Math.random() < 0.1) {
                buttons[2].setLabel(randomWORDs[Math.floor(Math.random() * randomWORDs.length)]);
            }
        }

        const redRole = Math.random();

        if (redRole < 0.5) {
            buttons[0].setStyle(ButtonStyle.Danger);
            buttons[4].setStyle(ButtonStyle.Danger);

            buttons[1].setStyle(ButtonStyle.Secondary);
            buttons[2].setStyle(ButtonStyle.Secondary);
            buttons[3].setStyle(ButtonStyle.Secondary);
        }

        else if (redRole < 0.7) {
            buttons[1].setStyle(ButtonStyle.Danger);
            buttons[3].setStyle(ButtonStyle.Danger);

            buttons[4].setStyle(ButtonStyle.Secondary);
            buttons[2].setStyle(ButtonStyle.Secondary);
            buttons[0].setStyle(ButtonStyle.Secondary);
        }

        else if (redRole < 1) {
            buttons[2].setStyle(ButtonStyle.Danger);

            buttons[3].setStyle(ButtonStyle.Secondary);
            buttons[4].setStyle(ButtonStyle.Secondary);
            buttons[1].setStyle(ButtonStyle.Secondary);
            buttons[0].setStyle(ButtonStyle.Secondary);
        }

    strangeRow.setComponents(buttons);

    strangeMessage.edit({ components: [strangeRow] });

    }, 1000);

    // shift colours every 3000, cycle of shift.

}