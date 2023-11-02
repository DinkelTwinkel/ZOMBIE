/* eslint-disable no-trailing-spaces */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const CardBible = require('../models/cardBible');
// const Minted = require('../models/cardMinted');
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, Events } = require('discord.js');
const messageDeletionTimer = 10;
const mainImage = 'https://cdn.discordapp.com/attachments/1166362435947606068/1167075549479440404/lafound.jpg?ex=654ccece&is=653a59ce&hm=c72c87106fc371a603a60dd14ae0c0caab6590cb0194cc1f78408081caa1dd75&';

module.exports = async (client, BACKROOMS, storageCategory, hellMart) => {

	// Check for Image. IF not image, DELETE & ephemeral reply. Or get CDN from image post?.
	const lostAndFoundBox = await hellMart.channels.cache.get('1167042254666469376');
    
	const messages = await lostAndFoundBox.messages.fetch();
	lostAndFoundBox.bulkDelete(messages);

    await lostAndFoundBox.send({ files: [{ attachment: mainImage }] });
    lostAndFoundBox.send({ content: 'If y0u found a cool 1mage post it her3' });

	// This whole thing is a handler for different button clicks.
	client.on(Events.InteractionCreate, async (interaction) => {

		if (!interaction.isButton()) return;

		if (interaction.customId === 'mintCard') {
			mintCard(interaction, hellMart);
		}

		if (interaction.customId === 'deleteUnminted') {
			const query = { messageId: interaction.message.id };
			const result = await CardBible.deleteOne(query);

			if (result.deletedCount === 1) {
				console.log('Successfully deleted Mint document.');
				const confirmationMessage = await interaction.channel.send('Mint deleted Successfully');
				setTimeout(() => {
					confirmationMessage.delete();
				}, messageDeletionTimer * 1000);
			}
			else {
				console.log('No documents matched the query. Deleted 0 documents.');
			}
			interaction.message.delete();

		}

		if (interaction.customId === 'moveMint') {

			// future feature

		}

		if (interaction.customId === 'pauseMint') {

			// future feature

		}

		if (interaction.customId === 'deleteMint') {
			const query = { messageId: interaction.message.id };
			const result = await CardBible.deleteOne(query);

			if (result.deletedCount === 1) {
				console.log('Successfully deleted Mint document.');
				const confirmationMessage = await interaction.channel.send('Mint deleted Successfully');
				setTimeout(() => {
					confirmationMessage.delete();
				}, messageDeletionTimer * 1000);

			}
			else {
				console.log('No documents matched the query. Deleted 0 documents.');
			}
			interaction.message.delete();
		}


	});

	client.on(Events.MessageCreate, async (message) => {

		if (message.author.bot) return;
		if (message.guild === BACKROOMS) {
			const channelsInStorage = BACKROOMS.channels.cache.filter((channel) => channel.parentId === storageCategory.id);
			channelsInStorage.forEach(channel => {
				if (message.channel != channel) return;
				console.log ('Message detected in Storage Channels. Attemping to mint');
				if (attachmentTest(message) === null) return console.log('Failed attachment Check');
				console.log ('succeeded check');
				createMintActionRow (message, attachmentTest(message), message.channel);
			});
		}
		else if (message.guild === hellMart) {

			// relays messages to the lost and found discord on the storage server.

			const receiverChannelID = '1166688334832222228';
			const receiverChannel = await BACKROOMS.channels.cache.get(receiverChannelID);

			if (message.channel == lostAndFoundBox) {
				console.log ('Message detected in User Submission. Attemping to mint');
				if (attachmentTest(message) === null) return console.log ('lost and Found submission failed image check');
				console.log ('succeeded check');
				createMintActionRow (message, attachmentTest(message), receiverChannel);
				message.channel.send('Submission Recieved, thank you for your entry. Once approved they will be added to the lost and found reference pool');
			}

		}


	});


};

async function mintCard(interaction, hellMart) {
	console.log('Card Mint Attempt Detected');
	console.log(interaction.message.attachments.first().url);
	// minting here, basically just take the message content, create new entry in the card bible with it. Replace message with Minted Card.

	const creatorMember = hellMart.members.cache.get (interaction.message.content);
	console.log(creatorMember);
	let creatorName;
	if (creatorMember) {
		creatorName = creatorMember.nickname;
	}
	else {
		creatorName = 'Unknown';
	}
	console.log (creatorName);

	// Create New Database Entry
	const bibleRecord = new CardBible ({
		messageId: interaction.message.id,
		imageLink: interaction.message.attachments.first().url,
		channelID: interaction.channel.id,
		creatorId: interaction.message.content,
		creatorName: creatorName,
		enabled: true,
	});

	await bibleRecord.save();

	// Adjust Message/Edit it to be in the form of a minted record.

	const togglePause = new ButtonBuilder()
		.setCustomId('pauseMint')
		.setLabel('PAUSE/RESUME Minting')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

	const moveMint = new ButtonBuilder()
		.setCustomId('moveMint')
		.setLabel('move')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

	const deleteMint = new ButtonBuilder()
		.setCustomId('deleteMint')
		.setLabel('DELETE')
		.setStyle(ButtonStyle.Danger);

	const mintedActionRow = new ActionRowBuilder ()
		.addComponents(togglePause, moveMint, deleteMint);

	console.log(interaction.message.embeds);
	const newEmbed = new EmbedBuilder (interaction.message.embeds[0]);
	newEmbed.setTitle('MINTED');
	console.log(newEmbed);

	interaction.message.edit({
		components: [mintedActionRow],
		embeds: [newEmbed],
	});

	interaction.reply({ content: 'Minting Successful', ephemeral: true });

	setTimeout(() => {
		interaction.deleteReply();
	}, messageDeletionTimer * 1000);
}

function attachmentTest(message) {
	const imageExtensions = /\.(png|jpeg|jpg|jpg|webp)/i;

	if (message.attachments.size > 0) {
		const attachment = message.attachments.first(); // Get the first attachment (usually the most recent one)

		// Regular expression to match image file extensions anywhere in the string

		if (imageExtensions.test(attachment.url)) {
			console.log('Valid image attachment found.');
			return attachment.url;
		}
		else {
			console.log('No valid image extension found in the attachment URL.');
			deleteMessageAndReply (message);
			return null;
		}
	}
	else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {

		if (imageExtensions.test(message.content)) {
			console.log('Valid image attachment found. Link CDN Edition');
			return message.content;

		}
		else {
			console.log('No valid image extension found in the attachment URL.');
			deleteMessageAndReply (message);
			return null;
		}
	}
	else {
		deleteMessageAndReply (message);
		return null;
	}
}

async function deleteMessageAndReply(message) {

	const utcEpochTimestamp = Math.floor(Date.now() / 1000) + messageDeletionTimer;

	const response = await message.reply ({ content: 'Submission failed. Be sure it is uploaded or sent as a `https://cdn.discordapp.com/attachments/` Link\n' + `Self deleteing in <t:${utcEpochTimestamp}:R>`, ephemeral: true });
	setTimeout(() => {

		response.delete();
	}, messageDeletionTimer * 1000);

	message.delete();

}

async function createMintActionRow(message, attachment, deliveryChannel) {

	// create the reply
	const mintButton = new ButtonBuilder()
		.setCustomId('mintCard')
		.setLabel('Mint 🃏')
		.setStyle(ButtonStyle.Success);

	const deleteButton = new ButtonBuilder()
		.setCustomId('deleteUnminted')
		.setLabel('delete')
		.setStyle(ButtonStyle.Danger);

	const actionrow = new ActionRowBuilder ()
		.addComponents (mintButton, deleteButton);

	const embed = new EmbedBuilder()
		.setFooter({
			text: `Submitter: ${message.author.username} | SubmitterID: ${message.author.id}`,
		});


	deliveryChannel.send({
		content: message.author.id,
		components: [actionrow],
		embeds: [embed],
		files: [{ attachment: attachment }],
	});

	message.delete();

}