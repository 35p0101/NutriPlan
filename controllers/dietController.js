const DietModel = require('../models/DietModel');
const MealPlanModel = require('../models/MealPlanModel');
const { generateMealPlan, addGrammiToAllMeals } = require('../services/mealDbService');
const calc = require('../services/calculations');

function addGrammiToPlan(planData) {
    if (!planData) return planData;
    const result = {};
    for (const [giorno, dayData] of Object.entries(planData)) {
        result[giorno] = addGrammiToAllMeals(dayData);
    }
    return result;
}

module.exports = {
    showStep1(req, res) {
        res.render('diet/step1', { user: req.user, error: null });
    },

    showStep2(req, res) {
        const { goal } = req.query;
        if (!goal || !['slim', 'muscle'].includes(goal)) {
            return res.redirect('/diet/step1');
        }
        res.render('diet/step2', { user: req.user, goal, error: null });
    },

    showStep3(req, res) {
        const { goal, weight, height, activity } = req.query;

        if (!goal || !weight || !height || !activity) {
            return res.redirect('/diet/step1');
        }

        const bmi = calc.calcBMI(+weight, +height);
        const bmr = calc.calcBMR(+weight, +height, req.user.age, req.user.sex);
        const activityMultiplier = calc.getActivityMultiplier(activity);
        const tdee = calc.calcTDEE(bmr, activityMultiplier);
        const calories = calc.calcCalories(tdee, goal);
        const macros = calc.calcMacros(calories, goal, req.user.sex, +activity);
        const ideal = calc.calcIdealWeight(+height);
        const bmiCategory = calc.getBMICategory(bmi);
        const bmiPercent = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)).toFixed(1);

        res.render('diet/step3', {
            user: req.user,
            goal,
            weight: +weight,
            height: +height,
            activity,
            activityMultiplier,
            bmi,
            bmiPercent,
            calories,
            bmiCategory,
            ...macros,
            ...ideal,
            error: null
        });
    },

    async generatePlan(req, res) {
        try {
            const { goal, weight, height, activity_multiplier } = req.body;

            let activityLevel = 3;
            if (activity_multiplier >= 1.7) activityLevel = 4;
            else if (activity_multiplier >= 1.5) activityLevel = 3;
            else if (activity_multiplier >= 1.3) activityLevel = 2;
            else activityLevel = 1;

            const bmi = calc.calcBMI(+weight, +height);
            const bmr = calc.calcBMR(+weight, +height, req.user.age, req.user.sex);
            const tdee = calc.calcTDEE(bmr, +activity_multiplier);
            const calories = calc.calcCalories(tdee, goal);
            const macros = calc.calcMacros(calories, goal, req.user.sex, activityLevel);
            const ideal = calc.calcIdealWeight(+height);

            await DietModel.upsert({
                user_id: req.user.id,
                goal,
                weight: +weight,
                height: +height,
                activity_multiplier: +activity_multiplier,
                bmi,
                calories,
                target_weight: ideal.targetWeight,
                ideal_min: ideal.idealMin,
                ideal_max: ideal.idealMax,
                ...macros
            });

            const plan = await generateMealPlan(goal, calories, macros);
            const planWithGrammi = addGrammiToPlan(plan);
            const today = new Date().toISOString().split('T')[0];

            await MealPlanModel.upsert({
                diet_id: 1,
                user_id: req.user.id,
                week_start: today,
                plan_json: JSON.stringify(planWithGrammi)
            });

            res.redirect('/dashboard');
        } catch (err) {
            console.error('Errore generazione piano:', err);
            const { goal, weight, height, activity } = req.body;
            res.render('diet/step3', {
                user: req.user,
                goal,
                weight: +weight,
                height: +height,
                activity,
                error: 'Errore nella generazione del piano. Riprova più tardi.'
            });
        }
    }
};