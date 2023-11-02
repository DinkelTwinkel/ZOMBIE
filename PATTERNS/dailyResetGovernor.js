const Time = require('../models/time');
const Visitor = require('../models/visitors');
const newVisitor = require('./newVisitor');

module.exports = async (hellMart) => {

    // console.log ();

    const members = hellMart.members.cache;
    members.forEach((member) => {
        if (member.user.id === '236216554235232256') return;
        if (member.user.bot) return;
        checkMemberTime(member);
    });

};

async function checkMemberTime(member) {

    // don't do check if account is server owner.

    const warningChannel = member.guild.channels.cache.get('1165477336985124874');

    const now = new Date();

    // Add 24 hours to the current date and time
    now.setUTCHours(now.getUTCHours() + 24);
    // Get the UTC milliseconds for the date 24 hours from now
    const utcMilliseconds = now.getTime();

    let memberTime = await Time.findOne({ userID: member.user.id });
    let memberInfo = await Visitor.findOne({ userID: member.user.id });

    if (!memberInfo) {
        await newVisitor(member);
        memberInfo = await Visitor.findOne({ userID: member.user.id });
    }

    if (!memberTime) {
        memberTime = new Time ({
            userID: member.user.id,
            nextResetTime: utcMilliseconds,
            inDungeon: false,
            nextDungeonReset: 0,
            dailyFortune: 'misgenerated',
        });
        // member.roles.set([]);
    }

    if (Date.now() > memberTime.nextResetTime) {
        // do resetting + take roles away.
       // member.roles.set([]);
        memberTime.nextResetTime = utcMilliseconds;
        // do various delete health things etc.
        if (memberInfo.currentXP > 0) {
        memberInfo.currentXP = memberInfo.currentXP - 1;
        }

        console.log (`${member.nickname} has been inactive!`);

        warningChannel.send(`${member.nickname} is fading away...`);

        if (memberInfo.life > 0) {
            if (memberInfo.currentXP === 0) {
                // lose health
                memberInfo.life = memberInfo.life - 1;
                if (memberInfo.life === 0) {
                    // warning send out
                    // send a warning to warning channel
                    warningChannel.send(`${member} you are fading away... if you do nothing your connection to Hell Mart will cease to exist in 24 hours.`);
                }
            }
        }
        else {
            member.kick();
            warningChannel.send(`${member.nickname} has returned to the void...`);
        }

        // xp DECAY
        // if xp = 0 then lose health
        //
    }

    await memberTime.save();
    await memberInfo.save();
    if (memberInfo.inDungeon === true) {
        // write some code here for checkin the now against dungeon reset time.
        if (Date.now() > memberTime.nextDungeonReset) {
        // Do stuff. Take away HP and then set next timeer.
        }
    }

}