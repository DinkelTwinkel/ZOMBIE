const { ActionRowBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const mainImage = 'https://cdn.discordapp.com/attachments/1166362435947606068/1166386103578792048/2e9bfddda704dd23c85677608a01c6cf.png?ex=654a4cb5&is=6537d7b5&hm=17911a05613836761e5d8f8e4e792fc00edfca95baa2cb2ea82b8c91522e81fd&';
const VendingCoins = require('../models/vendingCoins');
const Visitor = require('../models/visitors');
// const Visitor = require('../models/visitors');

module.exports = async (storageGuild, storageCategory, vendingChannel, client) => {

	// delete all previous messages in channel.

	const messages = await vendingChannel.messages.fetch();
	vendingChannel.bulkDelete(messages);

    const ratText = await vendingChannel.send(':mouse_trap:');
    ratBar(ratText);

	await vendingChannel.send({ files: [{ attachment: mainImage }] });

	const startButton = new ButtonBuilder ()
		.setCustomId('startGatcha')
		.setLabel('🔘 START')
		.setStyle(ButtonStyle.Danger);

	const startButtonAlt = new ButtonBuilder ()
		.setCustomId('startGatcha')
		.setLabel('🔴 START')
		.setStyle(ButtonStyle.Danger);

	const voucher = new ButtonBuilder ()
		.setCustomId('useVoucher')
		.setLabel('Voucher')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

	const kick = new ButtonBuilder ()
		.setCustomId('kickVending')
		.setLabel('kick')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

    const greenBar = new ButtonBuilder ()
		.setCustomId('greenBarVending')
		.setLabel('🟩')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

	const row0 = new ActionRowBuilder()
		.addComponents(startButton, voucher, kick, greenBar);

	const row0alt = new ActionRowBuilder()
		.addComponents(startButtonAlt, voucher, kick, greenBar);


	const startRow = await vendingChannel.send({
		content: '``⠀⠈⢲⣤⣿⣿⣿⣿⣿⣿⣷⣿⣿⣻⣎⣿⣻⣿⢿⣿⣿⣿⣽⣾⣿⣿⣿⣴⣴⣿⣿⣿⣾⣿⣿⣿⡇ ⠛⣻⣿⣿⣿⣿⣿⣵⣾⣿⣿⣿⣿⣿⡿⡻⠿⠃``',
		components: [row0],
	});

	setInterval(function() {


		if (Math.random() < 0.3) {
			startRow.edit({
				content: '``⠀⠈⢲⣤⣿⣿⣿⣿⣿⣿HA⣿⣿⣻⣎⣿⣻⣿⢿⣿⣿⣿⣽⣾⣿⣿⣿⣴⣴⣿⣿⣿⣾⣿⣿⣿⡇ ⠛⣻⣿⣿⣿⣿⣿⣵HA⣿⣿⣿⣿⣿⡿⡻⠿⠃``',
				components: [row0alt],
			});

			startRow.edit({
				content: '``⠀⠈⢲⣤⣿⣿⣿⣿⣿⣿⣷⣿⣿⣻⣎⣿⣻⣿⢿⣿⣿⣿⣽⣾⣿⣿⣿⣴⣴⣿⣿⣿⣾⣿⣿⣿⡇ ⠛⣻⣿⣿⣿⣿⣿⣵⣾⣿⣿⣿⣿⣿⡿⡻⠿⠃``',
				components: [row0],
			});
		}
		else {
			//
		}

		if (Math.random() < 0.3) {
		greenBar.setDisabled(true);
		startRow.edit({ components: [row0] });
		greenBar.setDisabled(false);
		startRow.edit({ components: [row0] });
		}

	}, 3000);

    // place rat bar here.

	client.on(Events.InteractionCreate, async (i) => {

		if (i.customId == 'greenBarVending') {
			await i.deferUpdate({ ephemeral: true });
		}


		if (i.customId == 'startGatcha') {

			await i.deferReply({ ephemeral: true });
			const uniqueRequestAssignment = Date.now() + i.member.user.id;

			// Obtain all the Channels in the storage Category.

			const channelsInStorage = storageGuild.channels.cache.filter((channel) => channel.parentId === storageCategory.id);

			const typeSelect = new StringSelectMenuBuilder()
				.setCustomId(`gatchType${uniqueRequestAssignment}`)
				.setPlaceholder('CHOOSE');

			channelsInStorage.forEach(channel => {

				const option = new StringSelectMenuOptionBuilder()
					.setLabel(channel.name)
					.setValue(channel.id);

				if (channel.topic) option.setDescription(channel.topic);

				typeSelect.addOptions(option);

			});

			const row1 = new ActionRowBuilder()
				.addComponents(typeSelect);

			// check if user has vending coin inventory and if not create one
			const result = await VendingCoins.findOne({ userID: i.member.user.id });
			if (!result) {
				console.log('No Vending Machine Coin Inventory detected. Creating one for user ' + i.member.name);
				const vendingCoins = new VendingCoins ({
					userID: i.member.user.id,
				});
				await vendingCoins.save();
				console.log ('new vendingCoin document.');
			}

			await i.editReply ({ components: [row1], ephemeral: true });

			const filter = (interaction) => interaction.customId === `gatchType${uniqueRequestAssignment}` && interaction.isStringSelectMenu();
			const typeCollector = i.channel.createMessageComponentCollector({ filter, time: 30000 });

			typeCollector.on('collect', async (interaction) => {

				await interaction.deferReply({ ephemeral: true });

				const selectedItemType = interaction.values[0];

				await interaction.editReply({ content: `Selected item type: ${selectedItemType}` });

				const quantitySelectMenu = new StringSelectMenuBuilder()
					.setCustomId(`quantity${uniqueRequestAssignment}`)
					.setPlaceholder('Select a quantity')
					.addOptions([
						{
							label: '1',
							value: '1',
						},
						{
							label: '5',
							value: '5',
						},
						{
							label: '10',
							value: '10',
						},
					]);

				await interaction.editReply({
					content: 'Please select a quantity:',
					components: [new ActionRowBuilder().addComponents(quantitySelectMenu)],
					ephemeral: true,
				});

				// typeCollector.stop(); // Stop the previous collector

				const quantityFilter = (quantityInteraction) => quantityInteraction.customId === `quantity${uniqueRequestAssignment}` && quantityInteraction.isStringSelectMenu();
				const quantityCollector = interaction.channel.createMessageComponentCollector({ filter: quantityFilter, time: 15000 });

				quantityCollector.on('collect', async (quantityInteraction) => {
					const selectedQuantity = quantityInteraction.values[0];
					createPurchaseConfirmation (quantityInteraction, selectedItemType, selectedQuantity, uniqueRequestAssignment);

					// create embed + buttons. Message Content  will contain selection type + quantity. Embed will show Category Name, quanity chosen, total cost.
					quantityCollector.stop();
					interaction.editReply({ content: '`quantity selected`', components: [] });
				});

				quantityCollector.on('end', () => {
					console.log('Quantity collector ended.');
				});

			});

			typeCollector.on('end', () => {
				console.log('Item type collector ended.');
				if (i.reply) {
					try {
						i.deleteReply();
					}
					catch (err) {
						console.log(err);
					}
				}
			});

		}

	},
	);

	async function createPurchaseConfirmation(interaction, selectedItemType, selectedQuantity, uniqueRequestAssignment) {

		const cost = 1 * selectedQuantity;

		const result = await VendingCoins.findOne({ userID: interaction.member.user.id });

		console.log (`${interaction.member.nickname} has: ` + result.coinsInMachine);
		console.log ('cost is: ' + cost);

		const pullButton = new ButtonBuilder ()
			.setCustomId(`pullCards${uniqueRequestAssignment}`)
			.setLabel('Not Enough')
			.setStyle(ButtonStyle.Danger)
			.setDisabled(true);

		if (result.coinsInMachine >= cost) {
			pullButton.setDisabled(false);
			pullButton.setLabel('PULL?');
			pullButton.setStyle(ButtonStyle.Success);
		}

		const channelsInStorage = storageGuild.channels.cache.filter((channel) => channel.parentId === storageCategory.id);

		const selectedChannel = await channelsInStorage.filter((channel) => channel.id === selectedItemType);


		const insertCoin = new ButtonBuilder ()
			.setCustomId(`insertCoin${uniqueRequestAssignment}`)
			.setLabel('insert coin')
			.setStyle(ButtonStyle.Secondary);

		const controlRow = new ActionRowBuilder ()
			.addComponents(pullButton, insertCoin);

		const embed = new EmbedBuilder()
			.setAuthor({
				name: `${selectedChannel.first().name}  ◄`,
			})
			.setTitle('\n')
			.setDescription(`Quantity: ${selectedQuantity} \n cost: ${cost} hellions`)
			.setThumbnail('https://cdn.discordapp.com/attachments/1166362435947606068/1166739836607135855/ezgif.com-optimize.gif?ex=654b9626&is=65392126&hm=ce62ddc6cd529e8483d979cfb246f0e6e2bca33492a5d9530c3a2291e38dcb32&')
			.setColor('#ff1a3c');
		// .setFooter({
		//     text: "5!21399489124891",
		// });

		await interaction.reply({ content:'`5!1166309471144923196`', embeds: [embed], components: [controlRow], ephemeral: true });

		client.on(Events.InteractionCreate, async (insertCoinInteraction) => {
			if (insertCoinInteraction.customId == `insertCoin${uniqueRequestAssignment}`) {

                const playerInfo = await Visitor.findOne({ userID: insertCoinInteraction.member.user.id });

                if (playerInfo.coins >= 1) {
                    playerInfo.coins -= 1;
                    await playerInfo.save();
                }
                else {
                    return insertCoinInteraction.reply({ content: 'You are broke. Brokie. Get a job.', ephemeral: true, files: [{ attachment:'https://cdn.discordapp.com/attachments/1168219599519633510/1168219633808048189/1116184732600955001.png?ex=6550f851&is=653e8351&hm=5908e1a1feebd25dcf53dcc85a6e1f2f3b1a9322a138a0f03c3b72963be92fde&' }] });
                }

				console.log ('coinInsertionDetected');
				result.coinsInMachine += 1;
				await result.save();

				editPurchaseConfirmation (interaction, selectedItemType, selectedQuantity, uniqueRequestAssignment);

                const clicks = ['click', 'CLICK', '*click*'];
                let click = clicks[Math.floor(Math.random() * clicks.length)];
                if (Math.random() < 0.2) {
                    const altClicks = ['moan', 'meow', 'scream', 'help me', 'run', 'RUN', 'mom?', 'i love u', 'I\'m scared'];
                    click = altClicks[Math.floor(Math.random() * altClicks.length)];
                }

                insertCoinInteraction.reply({ content: click, ephemeral: false }).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 100);
                });


			}
			else if (insertCoinInteraction.customId == `pullCards${uniqueRequestAssignment}`) {

				if (result.coinsInMachine >= cost) {


					result.coinsInMachine = result.coinsInMachine - cost ;

					await result.save();
					editPurchaseConfirmation (interaction, selectedItemType, selectedQuantity, uniqueRequestAssignment);
					// CARD PRINTING, requires cardbible library + cardminted database.
					const printCards = require('./printCard');
					//  await insertCoinInteraction.reply ({ content: 'PULLING', ephemeral: true });
					await insertCoinInteraction.deferReply({ ephemeral: true });
					printCards(insertCoinInteraction, selectedItemType, selectedQuantity);


				}


			}
		});

	}

	async function editPurchaseConfirmation(interaction, selectedItemType, selectedQuantity, uniqueRequestAssignment) {

		const cost = 1 * selectedQuantity;

		const result = await VendingCoins.findOne({ userID: interaction.member.user.id });

		console.log ('user has: ' + result.coinsInMachine);
		console.log ('cost is: ' + cost);

		const pullButton = new ButtonBuilder ()
			.setCustomId(`pullCards${uniqueRequestAssignment}`)
			.setLabel('Not Enough')
			.setStyle(ButtonStyle.Danger)
			.setDisabled(true);

		if (result.coinsInMachine >= cost) {
			pullButton.setDisabled(false);
			pullButton.setLabel('PULL?');
			pullButton.setStyle(ButtonStyle.Success);
		}

		const channelsInStorage = storageGuild.channels.cache.filter((channel) => channel.parentId === storageCategory.id);

		const selectedChannel = await channelsInStorage.filter((channel) => channel.id === selectedItemType);


		const insertCoin = new ButtonBuilder ()
			.setCustomId(`insertCoin${uniqueRequestAssignment}`)
			.setLabel('insert coin')
			.setStyle(ButtonStyle.Secondary);

		const controlRow = new ActionRowBuilder ()
			.addComponents(pullButton, insertCoin);

		const embed = new EmbedBuilder()
			.setAuthor({
				name: `${selectedChannel.first().name}  ◄`,
			})
			.setTitle('\n')
			.setDescription(`Quantity: ${selectedQuantity} \n cost: ${cost} hellions`)
			.setThumbnail('https://cdn.discordapp.com/attachments/1166362435947606068/1166739836607135855/ezgif.com-optimize.gif?ex=654b9626&is=65392126&hm=ce62ddc6cd529e8483d979cfb246f0e6e2bca33492a5d9530c3a2291e38dcb32&')
			.setColor('#ff1a3c');

		await interaction.editReply({ content: '`' + `${selectedQuantity}x${selectedItemType}` + '`', embeds: [embed], components: [controlRow], ephemeral: true });

	}

};

function ratBar(message) {

    console.log('ratbar activated');

    const updatePace = 400;

    const length = 32;
    const speed = 0.1;
    const rat = '🐀';
    const other = '_';

    let textBar = '';

    for (let index = 0; index < length; index++) {

        if (Math.random() < 0.1) {
            textBar = textBar.concat('▂');
        }
        else {
            textBar = textBar.concat(other);
        }
    }

    const stepSize = Math.ceil(length * speed);
    const steps = Math.floor(length / stepSize + 1);

    setInterval(() => {
        for (let step = 0; step < steps; step++) {
            // Change the rats position based on step.
            setTimeout(() => {
                const textBarArray = textBar.split('');
                textBarArray[ length - (step * stepSize) ] = rat;
                if (Math.random() < 0.3 && step != 0) textBarArray[ length - (step * stepSize) - 1 ] = '🧀';
                let newString = '';

                for (let s = 0; s < textBarArray.length; s++) {
                    newString = newString.concat(textBarArray[s]);
                }
                message.edit(':mouse_trap:`' + newString + '`');
            }, step * updatePace);
        }

        setTimeout(() => {
            message.edit(':mouse_trap:`' + textBar + '`');
        }, (steps + 1) * updatePace);
    }, 30000);

}

