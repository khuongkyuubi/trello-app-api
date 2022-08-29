const cardModel = require('../models/cardModel');
const listModel = require('../models/listModel');
const boardModel = require('../models/boardModel');
const userModel = require('../models/userModel');
const helperMethods = require('./helperMethods');

const create = async (title, listId, boardId, user, callback) => {
    try {
        // Get list and board
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate the ownership
        const validate = await helperMethods.validateCardOwners(null, list, board, user, true);
        if (!validate) return callback({errMessage: 'You dont have permission to add card to this list or board'});

        // Create new card
        const card = await cardModel({title: title});
        card.owner = listId;
        card.activities.unshift({text: `added this card to ${list.title}`, userName: user.name, color: user.color});
        card.labels = helperMethods.labelsSeed;
        await card.save();

        // Add id of the new card to owner list
        list.cards.push(card._id);
        await list.save();

        // Add log to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action: `added ${card.title} to this board`,
            color: user.color,
        });
        await board.save();

        // Set data transfer object
        const result = await listModel.findById(listId).populate({path: 'cards'}).exec();
        return callback(false, result);
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const getCard = async (cardId, listId, boardId, user, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) return callback({
            errMessage: 'You dont have permission to update this card',
        })

        let returnObject = {...card._doc, listTitle: list.title, listId: listId, boardId: boardId};

        return callback(false, returnObject);
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const update = async (cardId, listId, boardId, user, updatedObj, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) return callback({
            errMessage: 'You dont have permission to update this card'
        })

        //Update card
        await card.updateOne(updatedObj);
        await card.save();

        return callback(false, {message: 'Success!'});
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};


module.exports = {
    create,
    getCard,
    update,

}