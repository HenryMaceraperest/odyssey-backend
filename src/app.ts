import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
const app = express();

import timeRoute from './routes/time';
import flightRoutes from './routes/flightRoutes';
import searchResultRoutes from './routes/searchResult';

app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/time', timeRoute);
app.use('/routes', flightRoutes);
app.use('/searchresult', searchResultRoutes);

app.listen(4000, function () {
    console.log('Listening on port 4000!')
});
app.use(cors());