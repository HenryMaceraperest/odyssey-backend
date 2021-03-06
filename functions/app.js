const express = require('express');
const serverless = require('serverless-http');
const app = express();

const timeRoute = require('../src/routes/time');
const flightRoutes = require('../src/routes/flightRoutes');
const searchResultRoutes = require('../src/routes/searchResult')

app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/time', timeRoute);
app.use('/routes', flightRoutes);
app.use('/searchresult', searchResultRoutes);

module.exports.handler = serverless(app);