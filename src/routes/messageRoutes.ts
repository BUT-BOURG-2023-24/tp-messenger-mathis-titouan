const express = require('express');
const router = express.Router();

const messageController = require('../controller/messageController');

router.put('/:id', messageController.editMessage);
router.post('/:id', messageController.reactToMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;