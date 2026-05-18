const ApiKeyModel = require('../models/ApiKeyModel');

const keyCounters = new Map();
const KEY_WINDOW_MS = 60 * 1000; // 1 minuto

function checkKeyRate(apiKey, isPremium) {
    const now = Date.now();
    const limit = isPremium ? 600 : 60;
    const entry = keyCounters.get(apiKey) || { count: 0, start: now };
    if (now - entry.start > KEY_WINDOW_MS) {
        entry.start = now;
        entry.count = 0;
    }
    entry.count++;
    keyCounters.set(apiKey, entry);
    return entry.count <= limit;
}

const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key richiesta.' });
    }

    try {
        const keyData = await ApiKeyModel.findByKey(apiKey);
        if (!keyData) {
            return res.status(401).json({ error: 'API key non valida.' });
        }

        // Rifiuta chiavi revocate/disabilitate se presente il relativo flag
        if (keyData.revoked || keyData.is_revoked || keyData.disabled) {
            return res.status(401).json({ error: 'API key revocata.' });
        }

        const isPremium = !!keyData.is_premium;
        if (!checkKeyRate(apiKey, isPremium)) {
            return res.status(429).json({ error: 'Rate limit superato per questa API key.' });
        }

        // Aggiorna il timestamp di ultimo utilizzo (fire-and-forget)
        ApiKeyModel.updateLastUsed(keyData.id).catch(() => {});

        req.apiKey = { id: keyData.id, user_id: keyData.user_id, is_premium: isPremium };
        req.user = { id: keyData.user_id };
        next();
    } catch (err) {
        console.error('API key middleware error:', err);
        return res.status(500).json({ error: 'Errore interno' });
    }
};

module.exports = apiKeyMiddleware;