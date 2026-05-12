const DietModel = require('../models/DietModel');
const UserModel = require('../models/UserModel');
const calc = require('../services/calculations');
const MealPlanModel = require('../models/MealPlanModel');
const ApiKeyModel = require('../models/ApiKeyModel');
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
            const hasPremium = await ApiKeyModel.hasPremiumKeys(req.user.id);
            const premiumExpiry = hasPremium ? await ApiKeyModel.getPremiumExpiry(req.user.id) : null;
            const error = req.query.error || null;
            const success = req.query.success || null;
            res.render('profile', { user: currentUser, diet, bmiCategory, hasPremium, premiumExpiry, error, success });
        } catch (err) {
            console.error('Profile error:', err);
            res.render('profile', { user: req.user, diet: null, bmiCategory: null, hasPremium: false, premiumExpiry: null, error: 'Errore nel caricamento del profilo', success: null });
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
    },

    async showApiKeys(req, res) {
        try {
            const apiKeys = await ApiKeyModel.findAllByUser(req.user.id);
            const keyCount = apiKeys.length;
            
            const now = new Date();
            let hasPremium = false;
            
            for (const key of apiKeys) {
                if (key.is_premium === 1 && key.premium_expires_at) {
                    const expiry = new Date(key.premium_expires_at);
                    if (expiry > now) {
                        hasPremium = true;
                        break;
                    }
                }
            }
            
            console.log('API keys:', apiKeys.map(k => ({id: k.id, is_premium: k.is_premium, premium_expires_at: k.premium_expires_at})));
            console.log('hasPremium:', hasPremium);
            
            res.render('api-keys', {
                user: req.user,
                apiKeys,
                keyCount,
                hasPremium,
                error: req.query.error || null,
                success: req.query.success || null
            });
        } catch (err) {
            console.error('[showApiKeys] ERROR:', err.message, err.stack);
            res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
        }
    },

    async createApiKey(req, res) {
        try {
            const userId = req.user.id;
            const keyCount = await ApiKeyModel.countByUser(userId);
            const hasPremium = await ApiKeyModel.hasPremiumKeys(userId);

            if (keyCount >= 2 && !hasPremium) {
                return res.redirect('/api-keys?error=Limite di creazione raggiunto, passa a Premium');
            }

            const { name } = req.body;
            await ApiKeyModel.create(userId, name || 'API Key');
            res.redirect('/api-keys?success=API key creata con successo');
        } catch (err) {
            console.error('[createApiKey] ERROR:', err);
            res.redirect('/api-keys?error=' + encodeURIComponent(err?.message || 'Errore nella creazione della API key'));
        }
    },

    async deleteApiKey(req, res) {
        try {
            await ApiKeyModel.delete(req.params.id, req.user.id);
            res.redirect('/api-keys?success=API key eliminata');
        } catch (err) {
            console.error('Delete API key error:', err);
            res.redirect('/api-keys?error=Errore nell\'eliminazione della API key');
        }
    },

    showPremium(req, res) {
        res.render('api-premium', { user: req.user });
    },

    payPremium(req, res) {
        const business = process.env.PAYPAL_EMAIL;
        const returnUrl = `${req.protocol}://${req.get('host')}/api-keys/premium/activate`;
        const cancelUrl = `${req.protocol}://${req.get('host')}/api-keys/premium`;
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(business)}&item_name=NutriPlan+Premium&amount=2&currency_code=EUR&return=${encodeURIComponent(returnUrl)}&cancel_return=${encodeURIComponent(cancelUrl)}`;
        res.redirect(paypalUrl);
    },

    async confirmPremium(req, res) {
        try {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            
            const apiKeys = await ApiKeyModel.findAllByUser(req.user.id);
            for (const key of apiKeys) {
                await ApiKeyModel.setPremium(key.id, true, expiresAt.toISOString());
            }
            res.redirect('/api-keys?success=Premium attivato! Scadenza: ' + expiresAt.toLocaleDateString('it-IT'));
        } catch (err) {
            console.error('Confirm premium error:', err);
            res.redirect('/api-keys?error=Errore nell\'attivazione del premium');
        }
    },

    async activatePremium(req, res) {
        try {
            const { subscription_id } = req.query;
            if (!subscription_id) {
                return res.redirect('/api-keys?error=ID abbonamento mancante');
            }
            const apiKeys = await ApiKeyModel.findAllByUser(req.user.id);
            for (const key of apiKeys) {
                await ApiKeyModel.setPremium(key.id, true);
            }
            res.redirect('/api-keys?success=Premium attivato! Ora puoi generare API key illimitate.');
        } catch (err) {
            console.error('Activate premium error:', err);
            res.redirect('/api-keys?error=Errore nell\'attivazione del premium');
        }
    },

    async regeneratePlan(req, res) {
        try {
            const diet = await DietModel.findLatestByUser(req.user.id);
            if (!diet) {
                return res.status(404).json({ error: 'Nessuna dieta trovata.' });
            }

            const MealPlanModel = require('../models/MealPlanModel');
            const { generateMealPlan } = require('../services/mealDbService');

            const calorieTarget = diet.calories || 2000;
            const plan = await generateMealPlan(diet.goal, calorieTarget);
            const today = new Date().toISOString().split('T')[0];

            await MealPlanModel.upsert({
                diet_id: diet.id,
                user_id: req.user.id,
                week_start: today,
                plan_json: JSON.stringify(plan)
            });

            res.json({ success: true, plan });
        } catch (err) {
            console.error('Regenerate error:', err);
            res.status(500).json({ error: 'Errore rigenerazione piano.' });
        }
    }
};