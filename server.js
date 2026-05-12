require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const { initDb } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const dietRoutes = require('./routes/dietRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);
app.use('/diet', dietRoutes);
app.use('/', dashboardRoutes);
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`NutriPlan avviato su http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Errore inizializzazione database:', err);
    process.exit(1);
});