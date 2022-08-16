import express from 'express';
const router = express.Router();

import searchResultController from '../controllers/searchResult.controller';

export default router.get('/', searchResultController.getSearchResult);