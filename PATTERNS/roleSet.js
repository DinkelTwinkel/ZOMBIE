// this piece of code will set the role of the user/ Update it It will be called everytime there is a chance in the user roles and it
// will compile a new set of roles from all the data entries in the DB.

const Visitor = require('../models/visitors');
const Location = require('../models/location');

module.exports = async (member, locationOverride) => {

    // race role get
    // current location role get
    // future: colour roles, assistant store manager, life indicators, keys etc.

    const playerInfo = await Visitor.findOne({ userID: member.user.id });

    const raceRole = playerInfo.raceID;

    const playerLocation = await Location.findOne({ floor: playerInfo.currentLocation });

    let locationRole = playerLocation.locationAccessRoleID;

    if (locationOverride) locationRole = locationOverride;

    member.roles.set([raceRole, locationRole]);

    // array all of the roles together and set it
};