const db = require('../config/db');

const DietModel = {
    async create({ user_id, goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g }) {
        const stmt = db.prepare(`
            INSERT INTO diets (user_id, goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        return await stmt.run(user_id, goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g);
    },

    async update({ user_id, goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g }) {
        const stmt = db.prepare(`
            UPDATE diets SET goal = ?, weight = ?, height = ?, activity_multiplier = ?, bmi = ?, calories = ?,
            target_weight = ?, ideal_min = ?, ideal_max = ?, protein_g = ?, carbs_g = ?, fat_g = ?
            WHERE user_id = ?
        `);
        return await stmt.run(goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g, user_id);
    },

    async update({ user_id, goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g }) {
        const stmt = db.prepare(`
            UPDATE diets SET goal = ?, weight = ?, height = ?, activity_multiplier = ?, bmi = ?, calories = ?,
            target_weight = ?, ideal_min = ?, ideal_max = ?, protein_g = ?, carbs_g = ?, fat_g = ?, updated_at = datetime('now')
            WHERE user_id = ?
        `);
        return await stmt.run(goal, weight, height, activity_multiplier, bmi, calories, target_weight, ideal_min, ideal_max, protein_g, carbs_g, fat_g, user_id);
    },

    async upsert(data) {
        const existing = await this.findLatestByUser(data.user_id);
        if (existing) {
            return await this.update(data);
        }
        return await this.create(data);
    },

    async findLatestByUser(userId) {
        return await db.prepare('SELECT * FROM diets WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
    },

    async findById(id) {
        return await db.prepare('SELECT * FROM diets WHERE id = ?').get(id);
    }
};

module.exports = DietModel;