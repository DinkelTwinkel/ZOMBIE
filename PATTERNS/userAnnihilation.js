const Visitor = require('../models/visitors');
const Backpack = require('../models/backPack');

module.exports = async (member) => {

        // Remove Database Record.
        const query = { userID: member.user.id };
        const resultVisitor = await Visitor.deleteOne(query);

        if (resultVisitor.deletedCount === 1) {
            console.log('Successfully deleted visitor document.');
        }
        else {
            console.log('No documents matched the query. Deleted 0 documents.');
        }

        const resultBackpack = await Backpack.deleteOne(query);

        if (resultBackpack.deletedCount === 1) {
            console.log('Successfully deleted backpack document.');
        }
        else {
            console.log('No documents matched the query. Deleted 0 documents.');
        }

};