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

function calcMacros(calories, goal, sex = 'M', activityLevel = 3) {
    let proteinRatio, carbsRatio, fatRatio;

    const activityFactor = activityLevel >= 4 ? 1.1 : (activityLevel <= 2 ? 0.9 : 1.0);

    if (goal === 'slim') {
        if (sex === 'M') {
            proteinRatio = 0.32;
            carbsRatio = 0.38;
            fatRatio = 0.30;
        } else {
            proteinRatio = 0.35;
            carbsRatio = 0.35;
            fatRatio = 0.30;
        }
        proteinRatio *= activityFactor;
    } else {
        if (sex === 'M') {
            proteinRatio = 0.28;
            carbsRatio = 0.47;
            fatRatio = 0.25;
        } else {
            proteinRatio = 0.30;
            carbsRatio = 0.45;
            fatRatio = 0.25;
        }
        proteinRatio *= activityFactor;
        carbsRatio *= activityFactor;
    }

    const protein_g = Math.round((calories * proteinRatio) / 4);
    const carbs_g = Math.round((calories * carbsRatio) / 4);
    const fat_g = Math.round((calories * fatRatio) / 9);

    const totalCalFromMacros = (protein_g * 4) + (carbs_g * 4) + (fat_g * 9);
    const diff = calories - totalCalFromMacros;

    let adjustedCarbs = carbs_g;
    if (diff >= 4) {
        adjustedCarbs = Math.round((calories * carbsRatio + diff) / 4);
    } else if (diff <= -4) {
        adjustedCarbs = Math.round((calories * carbsRatio + diff) / 4);
    }

    return {
        protein_g,
        carbs_g: adjustedCarbs,
        fat_g
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