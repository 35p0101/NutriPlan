const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { calcBMI, getBMICategory } = require('../services/calculations');

module.exports = {
    showRegister(req, res) {
        res.render('register', { user: null, error: null });
    },

    showLogin(req, res) {
        res.render('login', { user: null, error: null });
    },

    async register(req, res) {
        try {
            const { username, email, password, password_confirm, dob, sex, profile_picture_base64 } = req.body;

            if (!username || !email || !password || !password_confirm || !dob || !sex) {
                return res.render('register', { user: null, error: 'Tutti i campi sono obbligatori' });
            }

            if (password !== password_confirm) {
                return res.render('register', { user: null, error: 'Le password non corrispondono' });
            }

            if (password.length < 6) {
                return res.render('register', { user: null, error: 'La password deve essere di almeno 6 caratteri' });
            }

            const existingEmail = await UserModel.findByEmail(email);
            if (existingEmail) {
                return res.render('register', { user: null, error: 'Email già registrata' });
            }

            const existingUsername = await UserModel.findByUsername(username);
            if (existingUsername) {
                return res.render('register', { user: null, error: 'Username già in uso' });
            }

            const dobDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }

            if (age < 13 || age > 120) {
                return res.render('register', { user: null, error: 'Età non valida (devi avere tra i 13 e i 120 anni)' });
            }

            const profilePicture = profile_picture_base64 || null;
            console.log('Creating user, profile pic length:', profilePicture ? profilePicture.length : 0);
            const result = await UserModel.create({ username, email, password, dob, age, sex, profile_picture: profilePicture });
            console.log('User created, id:', result.lastInsertRowid);

            const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('nutriplan_token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            res.redirect('/diet/step1');
        } catch (err) {
            console.error('Registration error:', err.message);
            res.render('register', { user: null, error: 'Errore durante la registrazione: ' + err.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.render('login', { user: null, error: 'Email e password sono obbligatorie' });
            }

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.render('login', { user: null, error: 'Email o password non validi' });
            }

            if (!UserModel.verifyPassword(password, user.password_hash)) {
                return res.render('login', { user: null, error: 'Email o password non validi' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('nutriplan_token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            res.redirect('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            res.render('login', { user: null, error: 'Errore durante il login' });
        }
    },

    logout(req, res) {
        res.clearCookie('nutriplan_token');
        res.redirect('/');
    }
};