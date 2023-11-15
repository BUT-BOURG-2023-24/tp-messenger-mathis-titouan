const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
import joiValidator from "../middleware/joiValidator";

const { conversationController } = require('../controller/conversationController');

// router.post('/', joiValidator, auth.checkAuth,  conversationController.createConversation);
// router.get('/', joiValidator, auth.checkAuth, conversationController.getAllConversationsForUser);
// router.delete('/:id', joiValidator, auth.checkAuth, conversationController.deleteConversation);
// router.get('/see/:id', joiValidator, auth.checkAuth, conversationController.getConversationById);
// router.post('/:id', joiValidator, auth.checkAuth, conversationController.addMessageToConversation);

module.exports = router;