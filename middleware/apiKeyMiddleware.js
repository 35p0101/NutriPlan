const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key richiesta. Usa header x-api-key.' });
    }

    const ApiKeyModel = require('../models/ApiKeyModel');
    const keyData = await ApiKeyModel.findByKey(apiKey);

    if (!keyData) {
        return res.status(401).json({ error: 'API key non valida.' });
    }

    await ApiKeyModel.updateLastUsed(keyData.id);
    req.apiKey = keyData;
    req.user = { id: keyData.user_id };
    next();
};

module.exports = apiKeyMiddleware;