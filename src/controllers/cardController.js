const cardService = require('../services/cardService');


const create = async (req, res) => {
    // get infor from req.body
    const {title, listId, boardId} = req.body;
    const user = req.user;

    // validate the inputs
    if(!(title && listId && boardId)) {
        return res
            .status(400)
            .send({errMessage: "Missing information"});

    }
    // Call card service
    	await cardService.create(title, listId, boardId, user, (err, result) => {
    		if (err) return res.status(500).send(err);
    		return res.status(201).send(result);
    	});
}

const getCard = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId } = req.params;

    // Call the card service
    await cardService.getCard(cardId, listId, boardId, user, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const update = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId } = req.params;

    // Call the card service
    await cardService.update(cardId, listId, boardId, user, req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const updateLabel = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId, labelId } = req.params;
    const label = req.body;

    // Call the card service
    await cardService.updateLabel(cardId, listId, boardId, labelId, user, label, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};
const updateLabelSelection = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId, labelId } = req.params;
    const { selected } = req.body;

    // Call the card service
    await cardService.updateLabelSelection(cardId, listId, boardId, labelId, user, selected, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const createLabel = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId } = req.params;
    const label = req.body;

    // Call the card service
    await cardService.createLabel(cardId, listId, boardId, user, label, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const addComment = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId } = req.params;

    // Call the card service
    await cardService.addComment(cardId, listId, boardId, user, req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const deleteComment = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId, commentId } = req.params;

    // Call the card service
    await cardService.deleteComment(cardId, listId, boardId, commentId, user, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const updateComment = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId, commentId } = req.params;

    // Call the card service
    await cardService.updateComment(cardId, listId, boardId, commentId, user, req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const deleteLabel = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId, labelId } = req.params;

    // Call the card service
    await cardService.deleteLabel(cardId, listId, boardId, labelId, user, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const insertAttachmentsCard = async (req, res) => {
    const {boardId,listId,cardId} = req.params;
    const user = req.user;
    const {link,linkName} = req.body;
    console.log(link,linkName)
    await cardService.addAttachmentToCard(cardId,listId,boardId,user,linkName,link,(err, result)=>{
        if(err) return res.status(500).send(err);
        return res.status(200).send(result);
    })
}

const addMember = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId } = req.params;

    // Call the card service
    await cardService.addMember(cardId, listId, boardId, user, req.body.memberId, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

const deleteMember = async (req, res) => {
    // Get params
    const user = req.user;
    const { boardId, listId, cardId, memberId } = req.params;

    // Call the card service
    await cardService.deleteMember(cardId, listId, boardId, user, memberId, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
};

module.exports = {
    create,
    getCard,
    update,
    updateLabel,
    updateLabelSelection,
    createLabel,
    addComment,
    deleteComment,
    updateComment,
    deleteLabel,
    insertAttachmentsCard,
    addMember,
    deleteMember,


}