import { Request, Response } from 'express';
import axios from 'axios';

const APIToFetch = 'https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices';

async function getValidUntil(req: Request, res: Response) {
    try {
        const apiRes = await axios.get(APIToFetch);
        let validUntil = apiRes.data.validUntil;
        res.json(validUntil);
    } catch (err) {
        console.log('Error!', err);
    }
};

export default { getValidUntil };