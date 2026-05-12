const db = require('../config/db');
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'nutriplan_salt_2024').digest('hex');
}

function verifyPassword(plainText, hash) {
    return hashPassword(plainText) === hash;
}

const UserModel = {
    async create({ username, email, password, dob, age, sex, profile_picture = null }) {
        const password_hash = hashPassword(password);
        return await db.prepare(
            `INSERT INTO users (username, email, password_hash, dob, age, sex, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(username, email, password_hash, dob, age, sex, profile_picture);
    },

    async findByEmail(email) {
        return await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    },

    async findByUsername(username) {
        return await db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    },

    async findById(id) {
        return await db.prepare('SELECT id, username, email, dob, age, sex, profile_picture, created_at FROM users WHERE id = ?').get(id);
    },

    async updateProfilePicture(id, profile_picture) {
        return await db.prepare('UPDATE users SET profile_picture = ? WHERE id = ?').run(profile_picture, id);
    },

    verifyPassword(plainText, hash) {
        return verifyPassword(plainText, hash);
    }
};

module.exports = UserModel;