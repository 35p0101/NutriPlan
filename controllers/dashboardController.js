const DietModel = require('../models/DietModel');
const UserModel = require('../models/UserModel');
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
            const currentUser = await UserModel.findById(req.user.id);
            const diet = await DietModel.findLatestByUser(req.user.id);
            const bmiCategory = diet ? calc.getBMICategory(diet.bmi) : null;
            const error = req.query.error || null;
            const success = req.query.success || null;
            res.render('profile', { user: currentUser, diet, bmiCategory, error, success });
        } catch (err) {
            console.error('Profile error:', err);
            res.render('profile', { user: req.user, diet: null, bmiCategory: null, error: 'Errore nel caricamento del profilo', success: null });
        }
    },

    async updateProfilePicture(req, res) {
        try {
            const { profile_picture_base64 } = req.body;
            console.log('Base64 length:', profile_picture_base64 ? profile_picture_base64.length : 0);
            
            let profilePicture = null;
            
            if (profile_picture_base64 && profile_picture_base64.startsWith('data:image')) {
                profilePicture = profile_picture_base64;
            } else {
                console.log('No valid image');
                return res.redirect('/profile?error=Nessuna immagine ricevuta');
            }
            
            console.log('Saving picture...');
            await UserModel.updateProfilePicture(req.user.id, profilePicture);
            console.log('Saved successfully');
            
            res.redirect('/profile?success=Foto profilo aggiornata');
        } catch (err) {
            console.error('Update picture error:', err.message);
            res.redirect('/profile?error=Errore: ' + err.message);
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