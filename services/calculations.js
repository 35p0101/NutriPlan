function calcBMI(weight, height) {
    return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
}

function calcBMR(weight, height, age, sex) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return sex === 'M' ? base + 5 : base - 161;
}

function calcTDEE(bmr, activityMultiplier) {
    return Math.round(bmr * activityMultiplier);
}

function calcCalories(tdee, goal) {
    return goal === 'slim' ? tdee - 400 : tdee + 250;
}

function calcMacros(calories, goal) {
    const ratios = goal === 'slim'
        ? { protein: 0.35, carbs: 0.40, fat: 0.25 }
        : { protein: 0.30, carbs: 0.45, fat: 0.25 };
    return {
        protein_g: Math.round((calories * ratios.protein) / 4),
        carbs_g: Math.round((calories * ratios.carbs) / 4),
        fat_g: Math.round((calories * ratios.fat) / 9)
    };
}

function calcIdealWeight(height) {
    const h2 = Math.pow(height / 100, 2);
    return {
        idealMin: Math.round(18.5 * h2),
        idealMax: Math.round(24.9 * h2),
        targetWeight: Math.round(21.7 * h2)
    };
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Sottopeso';
    if (bmi < 25) return 'Normopeso';
    if (bmi < 30) return 'Sovrappeso';
    return 'Obeso';
}

function getActivityMultiplier(level) {
    const multipliers = {
        '1': 1.2,
        '2': 1.375,
        '3': 1.55,
        '4': 1.725,
        '5': 1.9
    };
    return multipliers[level] || 1.2;
}

module.exports = {
    calcBMI,
    calcBMR,
    calcTDEE,
    calcCalories,
    calcMacros,
    calcIdealWeight,
    getBMICategory,
    getActivityMultiplier
};