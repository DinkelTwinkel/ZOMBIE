const Time = require('../models/time');
const Visitor = require('../models/visitors');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const newVisitor = require('./newVisitor');

module.exports = async (member, amount, client) => {

    const maxDailyXPGain = 10;

    const memberTime = await Time.findOne ({ userID: member.user.id });

    const toDate = new Date ().getDate();
    let memberInfo = await Visitor.findOne ({ userID: member.user.id });

    if (memberTime.lastXPcapDay != toDate) {
        memberTime.lastXPcapDay = toDate;
        memberTime.xpGainedToday = 0;
        memberInfo.coins += 1;
        // generate new fortune cookie.

        const newFortune = await getFortuneCookie(client);
        memberTime.dailyFortune = newFortune;
    }

    if (!memberInfo) {
        await newVisitor(member);
        memberInfo = await Visitor.findOne({ userID: member.user.id });
    }

    if (memberTime.xpGainedToday <= maxDailyXPGain) {
        if ((memberTime.xpGainedToday + amount) <= maxDailyXPGain) {
            memberTime.xpGainedToday = memberTime.xpGainedToday + amount;
            // add to visitor file.
            memberInfo.currentXP = memberInfo.currentXP + amount;
            console.log ('adding xp');
        }
        else {
            memberTime.xpGainedToday = maxDailyXPGain;
            memberInfo.currentXP = (maxDailyXPGain - memberTime.xpGainedToday) + memberInfo.currentXP;
            console.log ('adding xp');
        }
    }
    else {
        console.log ('Max Daily XP Reached');
    }

    memberTime.save();
    memberInfo.save();

};

async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1166314538593959986');
    const cookieChannel = backRooms.channels.cache.get('1167812440533250078');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }

