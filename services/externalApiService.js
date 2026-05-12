const fetch = require('node-fetch');

const FALLBACK_FOODS = {
    slim: [
        { name: 'Petto di Pollo', brand: 'Generico', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, image: null },
        { name: 'Riso Integrale', brand: 'Generico', calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, image: null },
        { name: 'Broccoli', brand: 'Generico', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, image: null },
        { name: 'Salmone', brand: 'Generico', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, image: null },
        { name: 'Uova', brand: 'Generico', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, image: null }
    ],
    muscle: [
        { name: 'Bistecca di Manzo', brand: 'Generico', calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0, image: null },
        { name: 'Pasta Integrale', brand: 'Generico', calories: 124, protein: 5, carbs: 25, fat: 0.5, fiber: 4.5, image: null },
        { name: 'Banana', brand: 'Generico', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, image: null },
        { name: 'Petto di Pollo', brand: 'Generico', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, image: null },
        { name: 'Riso Bianco', brand: 'Generico', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, image: null }
    ]
};

async function fetchFoodInfo(query) {
    try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3&json=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'NutriPlan/1.0 - School Project (https://github.com)'
            }
        });

        if (!response.ok) {
            console.error('Open Food Facts API error:', response.status);
            return null;
        }

        const text = await response.text();

        if (!text.startsWith('{') && !text.startsWith('[')) {
            console.error('Open Food Facts returned non-JSON response');
            return null;
        }

        const data = JSON.parse(text);
        return data.products || null;
    } catch (error) {
        console.error('Error fetching food info:', error);
        return null;
    }
}

async function getNutritionFacts(product) {
    return {
        name: product.product_name || product.product_name_fr || 'Prodotto sconosciuto',
        brand: product.brands || 'Marchio non specificato',
        calories: product.nutriments ? Math.round(product.nutriments['energy-kcal_100g'] || 0) : 0,
        protein: product.nutriments ? Math.round(product.nutriments.proteins_100g || 0) : 0,
        carbs: product.nutriments ? Math.round(product.nutriments.carbohydrates_100g || 0) : 0,
        fat: product.nutriments ? Math.round(product.nutriments.fat_100g || 0) : 0,
        fiber: product.nutriments ? Math.round(product.nutriments.fiber_100g || 0) : 0,
        image: product.image_small_url || product.image_url || null
    };
}

async function getFoodsByGoal(goal) {
    const query = goal === 'slim' ? 'chicken breast' : 'beef steak';
    const products = await fetchFoodInfo(query);

    if (products && products.length > 0) {
        const facts = await Promise.all(products.slice(0, 3).map(p => getNutritionFacts(p)));
        return facts;
    }

    return FALLBACK_FOODS[goal].slice(0, 3);
}

module.exports = { fetchFoodInfo, getNutritionFacts, getFoodsByGoal, FALLBACK_FOODS };