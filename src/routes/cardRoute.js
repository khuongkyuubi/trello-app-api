const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController')


router.post('/create', cardController.create);


module.exports = router;