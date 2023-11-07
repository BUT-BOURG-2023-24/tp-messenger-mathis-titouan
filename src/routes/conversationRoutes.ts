const express = require('express');
const router = express.Router();

const conversationController = require('../controller/conversationController');

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getAllConversationsForUser);
router.delete('/:id', conversationController.deleteConversation);
router.get('/see/:id', conversationController.getConversationById);
router.post('/:id', conversationController.addMessageToConversation);

module.exports = router;