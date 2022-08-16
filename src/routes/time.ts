import express from 'express';
import timeController from '../controllers/time.controller';

const router = express.Router();


export default router.get('/', timeController.getValidUntil);