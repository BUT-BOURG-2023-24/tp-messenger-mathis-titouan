const express = require('express');
const router = express.Router();

const userController = require('../controller/auth');

router.post('/online', userController.signup);
router.post('/login', userController.login);

module.exports = router;