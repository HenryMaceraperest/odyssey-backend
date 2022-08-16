"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const searchResultController = require('../controllers/searchResult.controller');
exports.default = router.get('/', searchResultController.get);
