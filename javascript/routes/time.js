"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const timeController = require('../controllers/time.controller');
exports.default = router.get('/', timeController.get);
