const DietModel = require('../models/DietModel');
const calc = require('../services/calculations');
const MealPlanModel = require('../models/MealPlanModel');
const { getMealDetail } = require('../services/mealDbService');
const { calcBMI, calcBMR, calcTDEE, calcCalories, calcMacros, calcIdealWeight, getBMICategory } = require('../services/calculations');

module.exports = {
    async showDashboard(req, res) {
        try {
            const diet = await DietModel.findLatestByUser(req.user.id);
            const mealPlan = await MealPlanModel.findLatestByUser(req.user.id);

            let planData = null;
            if (mealPlan) {
                try {
                    planData = JSON.parse(mealPlan.plan_json);
                } catch (e) {
                    planData = null;
                }
            }

            res.render('dashboard', {
                user: req.user,
                diet,
                mealPlan,
                planData,
                error: null
            });
        } catch (err) {
            console.error('Dashboard error:', err);
            res.render('dashboard', {
                user: req.user,
                diet: null,
                mealPlan: null,
                planData: null,
                error: 'Errore nel caricamento della dashboard'
            });
        }
    },

    async showProfile(req, res) {
        try {
            const diet = await DietModel.findLatestByUser(req.user.id);
            const bmiCategory = diet ? calc.getBMICategory(diet.bmi) : null;
            res.render('profile', { user: req.user, diet, bmiCategory, error: null });
        } catch (err) {
            console.error('Profile error:', err);
            res.render('profile', { user: req.user, diet: null, bmiCategory: null, error: 'Errore nel caricamento del profilo' });
        }
    },

    async showTips(req, res) {
        try {
            const diet = await DietModel.findLatestByUser(req.user.id);
            const goal = diet ? diet.goal : 'slim';
            res.render('tips', { user: req.user, diet, goal, error: null });
        } catch (err) {
            console.error('Tips error:', err);
            res.render('tips', { user: req.user, diet: null, goal: 'slim', error: 'Errore nel caricamento dei consigli' });
        }
    },

    async showMealDetail(req, res) {
        try {
            const mealName = req.params.name;
            const meal = await getMealDetail(mealName);
            if (!meal) {
                return res.redirect('/dashboard');
            }
            res.render('meal-detail', { user: req.user, meal, error: null });
        } catch (err) {
            console.error('Meal detail error:', err);
            res.redirect('/dashboard');
        }
    }
};