const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { optional } = require('../middleware/authMiddleware');

router.get('/login', optional, authController.showLogin);
router.post('/login', optional, authController.login);
router.get('/register', optional, authController.showRegister);
router.post('/register', optional, authController.register);
router.get('/logout', authController.logout);

module.exports = router;