const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
import joiValidator from "../middleware/joiValidator";

const messageController = require('../controller/messageController');

router.put('/:id', joiValidator, auth.checkAuth, messageController.editMessage);
router.post('/:id', joiValidator, auth.checkAuth, messageController.reactToMessage);
router.delete('/:id', joiValidator, auth.checkAuth, messageController.deleteMessage);

module.exports = router;