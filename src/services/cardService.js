const cardModel = require('../models/cardModel');
const listModel = require('../models/listModel');
const boardModel = require('../models/boardModel');
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
        // card.labels = board.labels;
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

        // board.labels = helperMethods.labelsSeed;
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

        // console.log(board.labels, "board");
        // console.log(card.labels, "card");

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) return callback({
            errMessage: 'You dont have permission to update this card',
        });
        for (let i = 0; i < board.labels.length; i++) {
            let label = false;
            for (let j = 0; j < card.labels.length; j++) {
                if (board.labels[i].text === card.labels[j].text) {
                    if (board.labels[i].color === card.labels[j].color) {
                        if (board.labels[i]._id.toString() === card.labels[j]._id.toString()) {
                            label = true;
                            break;
                        } else {

                        }

                    }
                }
            }
            // if(label === false){
            //     card.labels.push(board.labels[i]);
            // }
        }
        await card.save();

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

const updateLabel = async (cardId, listId, boardId, labelId, user, label, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }
        //Update label
        card.labels = card.labels.map((item) => {
            if (item._id.toString() === labelId.toString()) {
                item.text = label.text;
                item.color = label.color;
                item.backColor = label.backColor;
            }
            return item;
        });
        await card.save();
        board.labels = board.labels.map((item) => {
            if (item._id.toString() === labelId.toString()) {
                item.text = label.text;
                item.color = label.color;
                item.backColor = label.backColor;
            }
            return item;
        });
        await board.save();

        return callback(false, {message: 'Success!'});
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const updateLabelSelection = async (cardId, listId, boardId, labelId, user, selected, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }


        //Update label
        card.labels = card.labels.map((item) => {
            if (item._id.toString() === labelId.toString()) {
                item.selected = selected;
            }
            return item;
        });
        await card.save();

        return callback(false, {message: 'Success!'});
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};
const createLabel = async (cardId, listId, boardId, user, label, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to add label this card';
        }

        //Add label
        card.labels.unshift({
            text: label.text,
            color: label.color,
            backcolor: label.backColor,
            selected: true,
        });
        await card.save();
        board.labels.unshift({
            text: label.text,
            color: label.color,
            backcolor: label.backColor,
            selected: false,
        });
        await board.save();

        const labelId = card.labels[0]._id;

        return callback(false, {labelId: labelId});
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const uploadFile = async (cardId, file, callback) => {
    try {
        // const card = await cardModel.updateOne(cardId, {
        //     $push: {
        //         attachments: {
        //             link: file,
        //             name: file
        //         }
        //     }
        // })
        const card = await cardModel.findById(cardId);
        card.attachments.push( {
                       link: file,
                       name: file
                    });
        card.save();
        return callback(false,card)
    } catch (e) {
        return callback({errMessage: 'Something went wrong', details: e.message})
    }
};
const addAttachmentToCard = async(cardId,listId,boardId,user,linkName,link,callback) =>{
    try{
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
          return callback({errMessage: 'You dont have permission to add label this card'})
        }
        card.attachments.push( {
            link: link,
            name: linkName
        });
        card.save();
        return callback(false,card)
    }catch (e) {
        callback(true,{errMessage: 'Something went wrong', details: e.message})
    }
}


module.exports = {
    create,
    getCard,
    update,
    updateLabel,
    updateLabelSelection,
    createLabel,
    uploadFile,
    addAttachmentToCard
}