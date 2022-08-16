import express, { Request, Response } from 'express';
import axios from 'axios';

const APIToFetch = process.env.ROOT_API;

async function getFlightRoutes(req: Request, res: Response) {
    try {
        const apiRes = await axios.get(APIToFetch);
        let result = apiRes.data.legs;
        const allRoutes = [];
        for (let route of result) {
            allRoutes.push(route.routeInfo)
        }
        res.json(allRoutes);
    } catch (err) {
        console.log('Error!', err);
    }
}

export default { getFlightRoutes };