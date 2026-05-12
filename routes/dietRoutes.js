const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authRequired = require('../middleware/authMiddleware');

router.get('/step1', authRequired, dietController.showStep1);
router.get('/step2', authRequired, dietController.showStep2);
router.get('/step3', authRequired, dietController.showStep3);
router.post('/generate', authRequired, dietController.generatePlan);

module.exports = router;