const express = require('express');
const router = express.Router();
import joiValidator from "../middleware/joiValidator";

const userController = require('../controller/userController');

router.post('/login', joiValidator,userController.login);
router.get('/all', joiValidator, userController.getAllUsers);
router.post('/online', joiValidator, userController.getAllUsers);

module.exports = router;