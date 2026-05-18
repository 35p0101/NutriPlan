// Modello utente: operazioni CRUD minime e hashing password.
// ATTENZIONE: l'hashing usato è SHA256 con un salt statico definito
// qui per compatibilità con il codice esistente. SHA256 con salt
// statico è meno sicuro di bcrypt/argon2; valutare upgrade in futuro.
const db = require('../config/db');
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'nutriplan_salt_2024').digest('hex');
}

function verifyPassword(plainText, hash) {
    return hashPassword(plainText) === hash;
}

const UserModel = {
    async create({ username, email, password, dob, age, sex, profile_picture }) {
        const password_hash = hashPassword(password);
        
        if (profile_picture) {
            return await db.prepare(
                `INSERT INTO users (username, email, password_hash, dob, age, sex, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`
            ).run(username, email, password_hash, dob, age, sex, profile_picture);
        } else {
            return await db.prepare(
                `INSERT INTO users (username, email, password_hash, dob, age, sex) VALUES (?, ?, ?, ?, ?, ?)`
            ).run(username, email, password_hash, dob, age, sex);
        }
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

    async updatePassword(id, newPassword) {
        const password_hash = hashPassword(newPassword);
        return await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(password_hash, id);
    },

    async setPremium(userId, isPremium, expiresAt = null) {
        return await db.prepare('UPDATE users SET is_premium = ?, premium_expires_at = ? WHERE id = ?').run(isPremium ? 1 : 0, expiresAt, userId);
    },

    async isPremium(userId) {
        const user = await db.prepare('SELECT is_premium, premium_expires_at FROM users WHERE id = ?').get(userId);
        if (!user) return false;
        if (user.is_premium !== 1) return false;
        if (user.premium_expires_at && new Date(user.premium_expires_at) < new Date()) return false;
        return true;
    },

    async getPremiumExpiry(userId) {
        const user = await db.prepare('SELECT premium_expires_at FROM users WHERE id = ? AND is_premium = 1').get(userId);
        if (!user?.premium_expires_at) return null;
        if (new Date(user.premium_expires_at) < new Date()) return null;
        return user.premium_expires_at;
    },

    verifyPassword(plainText, hash) {
        return verifyPassword(plainText, hash);
    }
};

module.exports = UserModel;