"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const flightRoutesController = require('../controllers/flightRoutes.controller');
exports.default = router.get('/', flightRoutesController.get);
