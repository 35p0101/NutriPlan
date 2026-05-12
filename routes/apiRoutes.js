const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

router.get('/meal-plan', apiKeyMiddleware, apiController.getMealPlan);
router.get('/diet', apiKeyMiddleware, apiController.getDiet);
router.get('/recipes', apiController.getRecipes);
router.get('/food', apiController.getFoodInfo);
router.get('/foods-by-goal', apiController.getFoodsByGoal);
router.get('/meal/:name', apiController.getMealDetail);
router.post('/regenerate', apiKeyMiddleware, apiController.regeneratePlan);

module.exports = router;