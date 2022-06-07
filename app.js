const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const APIToFetch = 'https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices';

app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// API endpoint with all the routes, without providers
app.get('/', async (req, res, next) => {
    try {
        const apiRes = await axios.get(APIToFetch);
        result = apiRes.data.legs;
        const allRoutes = [];
        for (let route of result) {
            allRoutes.push(route.routeInfo)
        }
        res.json(allRoutes);
    } catch (err) {
        console.log('Error!', err);
    }
});

// API endpoint with the validUntil date-time
app.get('/time', async (req, res) => {
    try {
        const apiRes = await axios.get(APIToFetch);
        validUntil = apiRes.data.validUntil;
        res.json(validUntil);
    } catch (err) {
        console.log('Error!', err);
    }
});

// API endpoint with three queries required - from, to, date. Based on these, the appropriate flights are filtered out
app.get('/searchresult', async (req, res) => {
    try {
        const apiRes = await axios.get(APIToFetch);
        let result = apiRes.data.legs;
        // routesArray has all the routes from the api, including all the providers
        const routesArray = [];
        for (let route of result) { routesArray.push(route) };

        searchFrom = req.query.from;
        searchTo = req.query.to;
        searchDate = req.query.date;

        // first function to find the initial flight that matches the from-location, to-location, and the date
        function findFirstFlight(from, to, date) {
            try {
                // first array includes all the flights 
                firstArray = routesArray.filter(obj => obj.routeInfo.from.name == from && obj.routeInfo.to.name == to);
                secondArray = firstArray.filter(obj => obj.routeInfo.to.name == to);
                providerArray = secondArray.map(x => x.providers);
                trialArray = [];
                for (let x of providerArray) { for (let y of x) { trialArray.push(y) } };
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                thirdArray = trialArray.filter(obj => new Date(obj.flightStart).toLocaleDateString('en-CA', options) == date);
                thirdArray.sort((a, b) => { return new Date(a.flightStart) - new Date(b.flightStart) });
                thirdArray[0].flightFrom = from;
                thirdArray[0].flightTo = to;
                thirdArray[0].distance = secondArray[0].routeInfo.distance;
                return thirdArray;
            } catch (e) {
                console.log(`Server side error! No flight! ${e}`)
                res.status(401).send('Sorry, there is no flight for this route at this moment!')
            }
        };
        function findNextFlight(from, to, date) {
            try {
                firstArray = routesArray.filter(obj => obj.routeInfo.from.name == from);
                secondArray = firstArray.filter(obj => obj.routeInfo.to.name == to);
                providerArray = secondArray.map(x => x.providers);
                trialArray = [];
                for (let x of providerArray) { for (let y of x) { trialArray.push(y) } };
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                thirdArray = trialArray.filter(obj => new Date(obj.flightStart).toLocaleDateString('en-CA', options) >= date);
                thirdArray.sort((a, b) => { return new Date(a.flightStart) - new Date(b.flightStart) });
                thirdArray[0].flightFrom = from;
                thirdArray[0].flightTo = to;
                thirdArray[0].distance = secondArray[0].routeInfo.distance;
                return thirdArray;
            } catch (e) {
                console.log(`Server side error! No following flight! ${e}`)
                res.status(401).send('Sorry, one of the flights is not available at this moment! Please wait and try again later!')
            }
        };

        // CONNECTING FLIGHTS MERCURY - EARTH
        if (searchFrom.toLowerCase() == "mercury" && searchTo.toLowerCase() == "earth") {
            finalResult = [];
            findFirstFlight('Mercury', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
                finalresult = [];
            };
            res.json(finalResult);

            // CONNECTING FLIGHTS MERCURY - MARS
        } else if (searchFrom.toLowerCase() == "mercury" && searchTo.toLowerCase() == "mars") {
            finalResult = [];
            findFirstFlight('Mercury', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Jupiter', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Jupiter', 'Mars', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalresult = [];
                    };
                } catch (e) {
                    finalresult = [];
                };
            } catch (e) {
                finalresult = [];
            };
            res.json(finalResult);

            // CONNECTING FLIGHTS MERCURY - JUPITER
        } else if (searchFrom.toLowerCase() == "mercury" && searchTo.toLowerCase() == "jupiter") {

            finalResult = [];
            findFirstFlight('Mercury', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Jupiter', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // CONNECTING FLIGHTS MERCURY - SATURN
        } else if (searchFrom.toLowerCase() == "mercury" && searchTo.toLowerCase() == "saturn") {

            finalResult = [];
            findFirstFlight('Mercury', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Saturn', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // CONNECTING FLIGHTS MERCURY - URANUS
        } else if (searchFrom.toLowerCase() == "mercury" && searchTo.toLowerCase() == "uranus") {

            finalResult = [];
            findFirstFlight('Mercury', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT MERCURY - NEPTUNE
        } else if (searchFrom.toLowerCase() == "mercury" && searchTo.toLowerCase() == "neptune") {

            finalResult = [];
            findFirstFlight('Mercury', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Neptune', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // CONNECTING FLIGHTS VENUS - JUPITER
        } else if (searchFrom.toLowerCase() == "venus" && searchTo.toLowerCase() == "jupiter") {

            finalResult = [];
            findFirstFlight('Venus', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Jupiter', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT VENUS - MARS
        } else if (searchFrom.toLowerCase() == "venus" && searchTo.toLowerCase() == "mars") {

            finalResult = [];
            findFirstFlight('Venus', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Jupiter', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Jupiter', 'Mars', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT VENUS - SATURN
        } else if (searchFrom.toLowerCase() == "venus" && searchTo.toLowerCase() == "saturn") {

            finalResult = [];
            findFirstFlight('Venus', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Uranus', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Uranus', 'Saturn', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT VENUS - URANUS
        } else if (searchFrom.toLowerCase() == "venus" && searchTo.toLowerCase() == "uranus") {

            finalResult = [];
            findFirstFlight('Venus', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Uranus', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT VENUS - NEPTUNE
        } else if (searchFrom.toLowerCase() == "venus" && searchTo.toLowerCase() == "neptune") {

            finalResult = [];
            findFirstFlight('Venus', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Uranus', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Uranus', 'Neptune', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT EARTH - MERCURY
        } else if (searchFrom.toLowerCase() == "earth" && searchTo.toLowerCase() == "mercury") {

            finalResult = [];
            findFirstFlight('Earth', 'Jupiter', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Jupiter', 'Venus', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Venus', 'Mercury', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT EARTH - VENUS
        } else if (searchFrom.toLowerCase() == "earth" && searchTo.toLowerCase() == "venus") {

            finalResult = [];
            findFirstFlight('Earth', 'Jupiter', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Jupiter', 'Venus', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT EARTH - MARS
        } else if (searchFrom.toLowerCase() == "earth" && searchTo.toLowerCase() == "mars") {

            finalResult = [];
            findFirstFlight('Earth', 'Jupiter', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Jupiter', 'Mars', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT EARTH - SATURN
        } else if (searchFrom.toLowerCase() == "earth" && searchTo.toLowerCase() == "saturn") {

            finalResult = [];
            findFirstFlight('Earth', 'Uranus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Uranus', 'Saturn', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT EARTH - NEPTUNE
        } else if (searchFrom.toLowerCase() == "earth" && searchTo.toLowerCase() == "neptune") {

            finalResult = [];
            findFirstFlight('Earth', 'Uranus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Uranus', 'Neptune', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT MARS - MERCURY
        } else if (searchFrom.toLowerCase() == "mars" && searchTo.toLowerCase() == "mercury") {

            finalResult = [];
            findFirstFlight('Mars', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Mercury', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT MARS - EARTH
        } else if (searchFrom.toLowerCase() == "mars" && searchTo.toLowerCase() == "earth") {

            finalResult = [];
            findFirstFlight('Mars', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT MARS - JUPITER
        } else if (searchFrom.toLowerCase() == "mars" && searchTo.toLowerCase() == "jupiter") {

            finalResult = [];
            findFirstFlight('Mars', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Jupiter', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT MARS - SATURN
        } else if (searchFrom.toLowerCase() == "mars" && searchTo.toLowerCase() == "saturn") {

            finalResult = [];
            findFirstFlight('Mars', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Saturn', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT MARS - URANUS
        } else if (searchFrom.toLowerCase() == "mars" && searchTo.toLowerCase() == "uranus") {

            finalResult = [];
            findFirstFlight('Mars', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT MARS - NEPTUNE
        } else if (searchFrom.toLowerCase() == "mars" && searchTo.toLowerCase() == "neptune") {

            finalResult = [];
            findFirstFlight('Mars', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Neptune', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT JUPITER - MERCURY
        } else if (searchFrom.toLowerCase() == "jupiter" && searchTo.toLowerCase() == "mercury") {

            finalResult = [];
            findFirstFlight('Jupiter', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Mercury', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT JUPITER - EARTH
        } else if (searchFrom.toLowerCase() == "jupiter" && searchTo.toLowerCase() == "earth") {

            finalResult = [];
            findFirstFlight('Jupiter', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT JUPITER - SATURN
        } else if (searchFrom.toLowerCase() == "jupiter" && searchTo.toLowerCase() == "saturn") {

            finalResult = [];
            findFirstFlight('Jupiter', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Saturn', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT JUPITER - URANUS
        } else if (searchFrom.toLowerCase() == "jupiter" && searchTo.toLowerCase() == "uranus") {

            finalResult = [];
            findFirstFlight('Jupiter', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT JUPITER - NEPTUNE
        } else if (searchFrom.toLowerCase() == "jupiter" && searchTo.toLowerCase() == "neptune") {

            finalResult = [];
            findFirstFlight('Jupiter', 'Venus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Venus', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Uranus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Neptune', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            //FLIGHT SATURN - MERCURY
        } else if (searchFrom.toLowerCase() == "saturn" && searchTo.toLowerCase() == "mercury") {


            finalResult = [];
            findFirstFlight('Saturn', 'Neptune', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Neptune', 'Mercury', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT SATURN - VENUS
        } else if (searchFrom.toLowerCase() == "saturn" && searchTo.toLowerCase() == "venus") {

            finalResult = [];
            findFirstFlight('Saturn', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Jupiter', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Jupiter', 'Venus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT SATURN - MARS
        } else if (searchFrom.toLowerCase() == "saturn" && searchTo.toLowerCase() == "mars") {

            finalResult = [];
            findFirstFlight('Saturn', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Jupiter', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Jupiter', 'Mars', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);


            // FLIGHT SATURN - JUPITER
        } else if (searchFrom.toLowerCase() == "saturn" && searchTo.toLowerCase() == "jupiter") {

            finalResult = [];
            findFirstFlight('Saturn', 'Earth', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Earth', 'Jupiter', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT SATURN - URANUS
        } else if (searchFrom.toLowerCase() == "saturn" && searchTo.toLowerCase() == "uranus") {

            finalResult = [];
            findFirstFlight('Saturn', 'Neptune', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Neptune', 'Uranus', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT URANUS - MERCURY
        } else if (searchFrom.toLowerCase() == "uranus" && searchTo.toLowerCase() == "mercury") {

            finalResult = [];
            findFirstFlight('Uranus', 'Neptune', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Neptune', 'Mercury', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Jupiter', 'Mars', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Uranus', 'Saturn', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT URANUS - VENUS
        } else if (searchFrom.toLowerCase() == "uranus" && searchTo.toLowerCase() == "venus") {

            finalResult = [];
            findFirstFlight('Uranus', 'Neptune', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Neptune', 'Mercury', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Mercury', 'Venus', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT URANUS - EARTH
        } else if (searchFrom.toLowerCase() == "uranus" && searchTo.toLowerCase() == "earth") {

            finalResult = [];
            findFirstFlight('Uranus', 'Saturn', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Saturn', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT URANUS - MARS
        } else if (searchFrom.toLowerCase() == "uranus" && searchTo.toLowerCase() == "mars") {

            finalResult = [];
            findFirstFlight('Uranus', 'Saturn', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Saturn', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Jupiter', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Jupiter', 'Mars', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT URANUS - JUPITER
        } else if (searchFrom.toLowerCase() == "uranus" && searchTo.toLowerCase() == "jupiter") {

            finalResult = [];
            findFirstFlight('Uranus', 'Saturn', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Saturn', 'Earth', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Earth', 'Jupiter', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT NEPTUNE - VENUS
        } else if (searchFrom.toLowerCase() == "neptune" && searchTo.toLowerCase() == "venus") {

            finalResult = [];
            findFirstFlight('Neptune', 'Mercury', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Mercury', 'Venus', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT NEPTUNE - EARTH
        } else if (searchFrom.toLowerCase() == "neptune" && searchTo.toLowerCase() == "earth") {

            finalResult = [];
            findFirstFlight('Neptune', 'Uranus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Uranus', 'Saturn', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Saturn', 'Earth', flightEndRes);
                    finalResult.push(thirdArray[0]);
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT NEPTUNE - MARS
        } else if (searchFrom.toLowerCase() == "neptune" && searchTo.toLowerCase() == "mars") {

            finalResult = [];
            findFirstFlight('Neptune', 'Uranus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Uranus', 'Saturn', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Saturn', 'Earth', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Earth', 'Jupiter', flightEndRes);
                        finalResult.push(thirdArray[0]);
                        try {
                            flightEndRes = thirdArray[0].flightEnd;
                            findNextFlight('Jupiter', 'Mars', flightEndRes);
                            finalResult.push(thirdArray[0]);
                        } catch (e) {
                            finalResult.push(null)
                        };
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT NEPTUNE - JUPITER
        } else if (searchFrom.toLowerCase() == "neptune" && searchTo.toLowerCase() == "jupiter") {

            finalResult = [];
            findFirstFlight('Neptune', 'Uranus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Uranus', 'Saturn', flightEndRes);
                finalResult.push(thirdArray[0]);
                try {
                    flightEndRes = thirdArray[0].flightEnd;
                    findNextFlight('Saturn', 'Earth', flightEndRes);
                    finalResult.push(thirdArray[0]);
                    try {
                        flightEndRes = thirdArray[0].flightEnd;
                        findNextFlight('Earth', 'Jupiter', flightEndRes);
                        finalResult.push(thirdArray[0]);
                    } catch (e) {
                        finalResult.push(null)
                    };
                } catch (e) {
                    finalResult.push(null)
                };
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

            // FLIGHT NEPTUNE - SATURN
        } else if (searchFrom.toLowerCase() == "neptune" && searchTo.toLowerCase() == "saturn") {

            finalResult = [];
            findFirstFlight('Neptune', 'Uranus', searchDate);
            finalResult.push(thirdArray[0]);
            flightEndRes = thirdArray[0].flightEnd;
            try {
                flightEndRes = thirdArray[0].flightEnd;
                findNextFlight('Uranus', 'Saturn', flightEndRes);
                finalResult.push(thirdArray[0]);
            } catch (e) {
                finalResult.push(null)
            };
            res.json(finalResult);

        } else {
            firstArray = routesArray.filter(obj => obj.routeInfo.from.name.toLowerCase() == searchFrom.toLowerCase());
            secondArray = firstArray.filter(obj => obj.routeInfo.to.name.toLowerCase() == searchTo.toLowerCase());
            const providerArray = secondArray.map(x => x.providers)
            const trialArray = [];
            for (let x of providerArray) { for (let y of x) { trialArray.push(y) } }
            if (searchDate) {
                dateFilter = searchDate;
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                thirdArray = trialArray.filter(obj => new Date(obj.flightStart).toLocaleDateString('en-CA', options) == dateFilter);
                thirdArray.map(array => ((array.flightFrom = searchFrom), (array.flightTo = searchTo), (array.distance = secondArray[0].routeInfo.distance), (array.directFlight = true)));
                res.json(thirdArray);
            } else {
                trialArray.sort((a, b) => { return new Date(a.flightStart) - new Date(b.flightStart) })
                trialArray.map(array => ((array.flightFrom = searchFrom), (array.flightTo = searchTo), (array.distance = secondArray[0].routeInfo.distance), (array.directFlight = true)));
                res.json(trialArray);
            }
        }
    } catch (err) {
        console.log('Error!', err);
    }
});

app.listen(4000, function () {
    console.log('Listening on port 4000!')
});
app.use(cors());