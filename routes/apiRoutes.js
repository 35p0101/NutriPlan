const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const authRequired = require('../middleware/authMiddleware');

router.get('/meal-plan', authRequired, apiController.getMealPlan);
router.get('/diet', authRequired, apiController.getDiet);
router.get('/users/:id/diet', apiController.getPublicDiet);
router.post('/regenerate', authRequired, apiController.regeneratePlan);
router.get('/recipes', apiController.getRecipes);
router.get('/food', apiController.getFoodInfo);
router.get('/foods-by-goal', apiController.getFoodsByGoal);
router.get('/meal/:name', apiController.getMealDetail);

module.exports = router;