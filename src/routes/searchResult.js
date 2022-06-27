const express = require('express');
const router = express.Router();

const searchResultController = require('../controllers/searchResult.controller');

router.get('/', searchResultController.get);

module.exports = router;