const Visitor = require('../models/visitors');

module.exports = async (guild) => {

    // Fetch a list of all guild members
    const members = await guild.members.fetch();

    // Filter out bot users (if needed)
    const nonBotMembers = members.filter(member => !member.user.bot);

    // Process each user
    nonBotMembers.forEach(async (member) => {
        // Check if a document exists for the user in your MongoDB collection
        // If not, create a document for the user
        await createUserDocument(member);
        // await fixUserNickNames(member);
        // await fixRoles(member);
    });

}

async function createUserDocument(member) {
    const userId = member.user.id;
    const existingUser = await Visitor.findOne({ userID: member.user.id });
    const newVisitor = require('../PATTERNS/newVisitor');
    if (!existingUser) {

        await newVisitor(member);
        // console.log(`Created a document for user with ID: ${userId}`);
    }
    await newVisitor(member);
}

async function fixUserNickNames(member) {
    const userId = member.user.id;
    const existingUser = await Visitor.findOne({ userID: member.user.id });
    const owner = await member.guild.fetchOwner()
    console.log ( existingUser );
    console.log ( member );
    if (existingUser.name != member.nickname) {
        if (member === owner) {
            return member.send('Hi, I can\'t update your nickname as you are my master. Please do this by hand... new nickname: ' + existingUser.name);
        } else {
            console.log(`Fixing nickname for user with ID: ${userId}`);
            member.setNickname(existingUser.name);
        }
   
    }
}

async function fixRoles(member) {
    const userId = member.user.id;
    const existingUser = await Visitor.findOne({ userID: member.user.id });
    if (!member.roles.cache.has(existingUser.levelRoleID)) {
        console.log(`Adding Missing Role for User ID: ${userId}`);
        member.roles.add(existingUser.levelRoleID);
   
    }
}