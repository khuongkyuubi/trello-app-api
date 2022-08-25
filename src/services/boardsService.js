const boardModel = require("../models/boardModel");
const userModel = require("../models/userModel");
const create = async (req, callback) => {
    try {
        const { title, backgroundImageLink, members, isImage } = req.body;
        // Create and save new board
        let newBoard =  boardModel({ title, backgroundImageLink, isImage });
        await newBoard.save();

        // Add this board to owner's boards
        const user = await userModel.findById(req.user.id);
        user.boards.unshift(newBoard.id);
        await user.save();

        // Add user to members of this board
        let allMembers = [];
        allMembers.push({
            user: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            color: user.color,
            role: 'owner',
        });

        // Save newBoard's id to boards of members and,
        // Add ids of members to newBoard
        await Promise.all(
            members.map(async (member) => {
                const newMember = await userModel.findOne({ email: member.email });
                newMember.boards.push(newBoard._id);
                await newMember.save();
                allMembers.push({
                    user: newMember._id,
                    name: newMember.name,
                    surname: newMember.surname,
                    email: newMember.email,
                    color: newMember.color,
                    role: 'member',
                });
                //Add to board activity
                newBoard.activity.push({
                    user: user.id,
                    name: user.name,
                    action: `added user '${newMember.name}' to this board`,
                });
            })
        );

        // Add created activity to activities of this board
        newBoard.activity.unshift({ user: user._id, name: user.name, action: 'created this board', color: user.color });

        // Save new board
        newBoard.members = allMembers;
        await newBoard.save();

        return callback(false, newBoard);
    } catch (error) {
        return callback({
            errMessage: 'Something went wrong',
            details: error.message,
        });
    }
};
const getAll = async (userId, callback) => {
    try {
        // Get user
        const user = await userModel.findById(userId);

        // Get board's ids of user
        const boardIds = user.boards;

        // Get boards of user
        const boards = await boardModel.find({ _id: { $in: boardIds } }).sort({title: -1});
        // const boards = await boardModel.find();

        // Delete unneccesary objects
        boards.forEach((board) => {
            board.activity = undefined;
            board.lists = undefined;
        });

        return callback(false, boards);
    } catch (error) {
        return callback({ msg: 'Something went wrong', details: error.message });
    }
};

module.exports = {
    create,
    getAll,
};