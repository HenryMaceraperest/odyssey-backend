import express from 'express';
const router = express.Router();

import flightRoutesController from '../controllers/flightRoutes.controller';

export default router.get('/', flightRoutesController.getFlightRoutes);