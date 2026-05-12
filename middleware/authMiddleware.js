const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

module.exports = function authRequired(req, res, next) {
    const token = req.cookies['nutriplan_token'];
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        UserModel.findById(payload.userId).then(user => {
            req.user = user;
            if (!user) {
                res.clearCookie('nutriplan_token');
                return res.redirect('/login');
            }
            next();
        });
    } catch (err) {
        res.clearCookie('nutriplan_token');
        return res.redirect('/login');
    }
};

module.exports.optional = function authOptional(req, res, next) {
    const token = req.cookies['nutriplan_token'];
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        UserModel.findById(payload.userId).then(user => {
            req.user = user || null;
            next();
        });
    } catch {
        req.user = null;
        next();
    }
};