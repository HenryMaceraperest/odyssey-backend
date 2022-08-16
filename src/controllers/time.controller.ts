import { Request, Response } from 'express';
import axios from 'axios';

const APIToFetch = process.env.ROOT_API;

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