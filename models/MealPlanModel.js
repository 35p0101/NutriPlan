const db = require('../config/db');

const MealPlanModel = {
    async create({ diet_id, user_id, week_start, plan_json }) {
        const stmt = db.prepare(`
            INSERT INTO meal_plans (diet_id, user_id, week_start, plan_json)
            VALUES (?, ?, ?, ?)
        `);
        return await stmt.run(diet_id, user_id, week_start, plan_json);
    },

    async update({ diet_id, user_id, week_start, plan_json }) {
        const stmt = db.prepare(`
            UPDATE meal_plans SET diet_id = ?, week_start = ?, plan_json = ?
            WHERE user_id = ?
        `);
        return await stmt.run(diet_id, week_start, plan_json, user_id);
    },

    async upsert(data) {
        const existing = await this.findLatestByUser(data.user_id);
        if (existing) {
            return await this.update(data);
        }
        return await this.create(data);
    },

    async findLatestByUser(userId) {
        return await db.prepare('SELECT * FROM meal_plans WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1').get(userId);
    },

    async findById(id) {
        return await db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(id);
    }
};

module.exports = MealPlanModel;