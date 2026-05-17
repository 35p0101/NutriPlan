const DietModel = require('../models/DietModel');
const MealPlanModel = require('../models/MealPlanModel');
const { generateMealPlan, getRandomMeals, getMealDetail, addGrammiToAllMeals } = require('../services/mealDbService');
const { fetchFoodInfo, getNutritionFacts, getFoodsByGoal } = require('../services/externalApiService');
const js2xmlparser = require('js2xmlparser');
const { wantsXml } = require('../middleware/xmlMiddleware');

function addGrammiToPlan(planData) {
    if (!planData) return planData;
    const result = {};
    for (const [giorno, dayData] of Object.entries(planData)) {
        result[giorno] = addGrammiToAllMeals(dayData);
    }
    return result;
}

function toXmlOrJson(res, req, rootKey, data) {
    if (wantsXml(req)) {
        res.set('Content-Type', 'application/xml');
        return res.send(js2xmlparser.parse(rootKey, data));
    }
    res.json(data);
}

module.exports = {
    async getMealPlan(req, res) {
        try {
            const plan = await MealPlanModel.findLatestByUser(req.user.id);
            if (!plan) {
                return res.status(404).json({ error: 'Nessun piano trovato.' });
            }
            toXmlOrJson(res, req, 'mealPlan', {
                week_start: plan.week_start,
                plan: JSON.parse(plan.plan_json)
            });
        } catch (err) {
            console.error('API getMealPlan error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    },

    async getDiet(req, res) {
        try {
            const diet = await DietModel.findLatestByUser(req.user.id);
            if (!diet) {
                return res.status(404).json({ error: 'Nessuna dieta trovata.' });
            }
            toXmlOrJson(res, req, 'diet', diet);
        } catch (err) {
            console.error('API getDiet error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    },

    async getPublicDiet(req, res) {
        try {
            const apiKey = req.headers['x-api-key'];
            if (apiKey !== process.env.CLASS_API_KEY) {
                return res.status(401).json({ error: 'API key non valida.' });
            }
            const diet = await DietModel.findLatestByUser(req.params.id);
            if (!diet) {
                return res.status(404).json({ error: 'Nessuna dieta trovata.' });
            }
            const { goal, bmi, calories, protein_g, carbs_g, fat_g } = diet;
            toXmlOrJson(res, req, 'diet', { goal, bmi, calories, protein_g, carbs_g, fat_g });
        } catch (err) {
            console.error('API getPublicDiet error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    },

    async regeneratePlan(req, res) {
        try {
            const diet = await DietModel.findLatestByUser(req.user.id);
            if (!diet) {
                return res.status(404).json({ error: 'Nessuna dieta trovata.' });
            }

            const calorieTarget = diet.calories || 2000;
            const macroTargets = {
                protein_g: diet.protein_g,
                carbs_g: diet.carbs_g,
                fat_g: diet.fat_g
            };
            const plan = await generateMealPlan(diet.goal, calorieTarget, macroTargets);
            const planWithGrammi = addGrammiToPlan(plan);
            const today = new Date().toISOString().split('T')[0];

            await MealPlanModel.upsert({
                diet_id: diet.id,
                user_id: req.user.id,
                week_start: today,
                plan_json: JSON.stringify(planWithGrammi)
            });

            res.json({ success: true, plan });
        } catch (err) {
            console.error('Regenerate error:', err);
            res.status(500).json({ error: 'Errore rigenerazione piano.' });
        }
    },

    async getRecipes(req, res) {
        try {
            const meals = await getRandomMeals(6);
            toXmlOrJson(res, req, 'recipes', { recipes: meals });
        } catch (err) {
            console.error('API getRecipes error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    },

    async getFoodInfo(req, res) {
        try {
            const query = req.query.q || '';
            if (!query) {
                return res.status(400).json({ error: 'Parametro q richiesto.' });
            }

            const products = await fetchFoodInfo(query);
            if (!products || products.length === 0) {
                return toXmlOrJson(res, req, 'foods', { foods: [] });
            }
            const nutritionData = await Promise.all(products.map(p => getNutritionFacts(p)));
            toXmlOrJson(res, req, 'foods', { foods: nutritionData });
        } catch (err) {
            console.error('API getFoodInfo error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    },

    async getFoodsByGoal(req, res) {
        try {
            const goal = req.query.goal || 'slim';
            const foods = await getFoodsByGoal(goal);
            toXmlOrJson(res, req, 'foods', { foods });
        } catch (err) {
            console.error('API getFoodsByGoal error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    },

    async getMealDetail(req, res) {
        try {
            const meal = await getMealDetail(req.params.name);
            if (!meal) {
                return res.status(404).json({ error: 'Ricetta non trovata.' });
            }
            toXmlOrJson(res, req, 'meal', meal);
        } catch (err) {
            console.error('API getMealDetail error:', err);
            res.status(500).json({ error: 'Errore interno.' });
        }
    }
};