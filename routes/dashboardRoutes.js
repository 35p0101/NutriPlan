const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authRequired = require('../middleware/authMiddleware');
const { optional } = require('../middleware/authMiddleware');

router.get('/', optional, (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/dashboard', authRequired, dashboardController.showDashboard);
router.get('/profile', authRequired, dashboardController.showProfile);
router.post('/profile/update-picture', authRequired, dashboardController.updateProfilePicture);
router.get('/tips', authRequired, dashboardController.showTips);
router.get('/meal/:name', authRequired, dashboardController.showMealDetail);

module.exports = router;