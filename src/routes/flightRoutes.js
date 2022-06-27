const express = require('express');
const router = express.Router();

const flightRoutesController = require('../controllers/flightRoutes.controller')

router.get('/', flightRoutesController.get);

module.exports = router;