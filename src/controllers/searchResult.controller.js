const express = require('express');
const axios = require('axios');

const APIToFetch = 'https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices';

async function get(req, res) {
    try {
        const apiRes = await axios.get(APIToFetch);
        let result = apiRes.data.legs;
        // routesArray has all the routes from the api, including all the providers
        const routesArray = [];
        for (let route of result) { routesArray.push(route) };

        // FROM query
        searchFrom = req.query.from;

        // TO query
        searchTo = req.query.to;

        const FQ = searchFrom.toLowerCase();
        const TQ = searchTo.toLowerCase();

        // DATE query
        searchDate = req.query.date;

        /** Function that has four required parameters: date, origin, firstDestination, & secondDestination.
         * if the connecting flight has more flights, parameters thirdDestination & fourthDestination can be added.
         */
        const findConnectingFlight = (date, origin, firstDestination, secondDestination, thirdDestination, fourthDestination) => {
            /** Function inside findConnectingFlight to filter and find the first flight that matches all the parameters. */
            function findFirstFlight(from, to, date) {
                try {
                    // first array includes all the flights 
                    firstArray = routesArray.filter(obj => obj.routeInfo.from.name == from);
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
                    return thirdArray[0];
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
                    return thirdArray[0];
                } catch (e) {
                    console.log(`Server side error! No following flight! ${e}`)
                    res.status(401).send('Sorry, one of the flights is not available at this moment! Please wait and try again later!')
                }
            };
            finalResult = [];
            try {
                const firstArray = findFirstFlight(origin, firstDestination, date);
                finalResult.push(firstArray);
                const secondFlightDate = firstArray.flightEnd;
                const secondArray = findNextFlight(firstDestination, secondDestination, secondFlightDate);
                finalResult.push(secondArray);
                const thirdFlightDate = secondArray.flightEnd;
                if (thirdDestination) {
                    const thirdArray = findNextFlight(secondDestination, thirdDestination, thirdFlightDate);
                    finalResult.push(thirdArray);
                    const fourthFlightDate = thirdArray.flightEnd;
                    if (fourthDestination) {
                        const fourthArray = findNextFlight(thirdDestination, fourthDestination, fourthFlightDate);
                        finalResult.push(fourthArray);
                    };
                };
                return finalResult;

            } catch (e) {
                console.log(`Error in the findConnectingFlight final catch: ${e}`)
            }
        };

        switch (FQ) {
            case ('mercury'):
                switch (TQ) {
                    case ('earth'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mercury', 'Venus', 'Earth');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('mars'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mercury', 'Venus', 'Earth', 'Jupiter', 'Mars');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('jupiter'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mercury', 'Venus', 'Earth', 'Jupiter');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('saturn'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mercury', 'Venus', 'Earth', 'Uranus', 'Saturn');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('uranus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mercury', 'Venus', 'Earth', 'Uranus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('neptune'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mercury', 'Venus', 'Earth', 'Uranus', 'Neptune');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('venus'):
                switch (TQ) {
                    case ('jupiter'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Venus', 'Earth', 'Jupiter');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('mars'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Venus', 'Earth', 'Jupiter', 'Mars');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('saturn'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Venus', 'Earth', 'Uranus', 'Saturn');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('uranus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Venus', 'Earth', 'Uranus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('neptune'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Venus', 'Earth', 'Uranus', 'Neptune');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('earth'):
                switch (TQ) {
                    case ('mercury'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Earth', 'Jupiter', 'Venus', 'Mercury');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('venus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Earth', 'Jupiter', 'Venus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('mars'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Earth', 'Jupiter', 'Mars');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('saturn'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Earth', 'Uranus', 'Saturn');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('neptune'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Earth', 'Uranus', 'Neptune');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('mars'):
                switch (TQ) {
                    case ('mercury'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mars', 'Venus', 'Mercury');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('earth'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mars', 'Venus', 'Earth');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('jupiter'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mars', 'Venus', 'Earth', 'Jupiter');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('saturn'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mars', 'Venus', 'Earth', 'Uranus', 'Saturn');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('uranus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mars', 'Venus', 'Earth', 'Uranus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('neptune'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Mars', 'Venus', 'Earth', 'Uranus', 'Neptune');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('jupiter'):
                switch (TQ) {
                    case ('mercury'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Jupiter', 'Venus', 'Mercury');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('earth'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Jupiter', 'Venus', 'Earth');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('saturn'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Jupiter', 'Venus', 'Earth', 'Uranus', 'Saturn');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('uranus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Jupiter', 'Venus', 'Earth', 'Uranus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('neptune'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Jupiter', 'Venus', 'Earth', 'Uranus', 'Neptune');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('saturn'):
                switch (TQ) {
                    case ('mercury'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Saturn', 'Neptune', 'Mercury');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('venus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Saturn', 'Earth', 'Jupiter', 'Venus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('mars'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Saturn', 'Earth', 'Jupiter', 'Mars');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('jupiter'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Saturn', 'Earth', 'Jupiter');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('uranus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Saturn', 'Neptune', 'Uranus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('uranus'):
                switch (TQ) {
                    case ('mercury'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Uranus', 'Neptune', 'Mercury');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('venus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Uranus', 'Neptune', 'Mercury', 'Venus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('earth'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Uranus', 'Saturn', 'Earth');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('mars'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Uranus', 'Saturn', 'Earth', 'Jupiter', 'Mars');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('jupiter'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Uranus', 'Saturn', 'Earth', 'Jupiter');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
            case ('neptune'):
                switch (TQ) {
                    case ('venus'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Neptune', 'Mercury', 'Venus');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('earth'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Neptune', 'Uranus', 'Saturn', 'Earth');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('jupiter'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Neptune', 'Uranus', 'Saturn', 'Earth', 'Jupiter');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                    case ('saturn'):
                        try {
                            const finalResult = findConnectingFlight(searchDate, 'Neptune', 'Uranus', 'Saturn');
                            res.json(finalResult);
                        } catch { finalResult = [] };
                        break;
                }
                break;
        };

        if ((FQ === 'earth' && (TQ === 'jupiter' || TQ === 'uranus')) || (FQ === 'jupiter' && (TQ === 'mars' || TQ === 'venus')) || (FQ === 'mars' && (TQ === 'venus')) || (FQ === 'neptune' && (TQ === 'mercury' || TQ === 'uranus')) || (FQ === 'saturn' && (TQ === 'earth' || TQ === 'neptune')) || (FQ === 'uranus' && (TQ === 'neptune' || TQ === 'saturn')) || (FQ === 'venus' && (TQ === 'earth' || TQ === 'mercury')) || (FQ === 'mercury' && (TQ === 'venus'))) {
            try {
                firstArray = routesArray.filter(obj => obj.routeInfo.from.name.toLowerCase() == searchFrom.toLowerCase());
                secondArray = firstArray.filter(obj => obj.routeInfo.to.name.toLowerCase() == searchTo.toLowerCase());
                mappingArray = secondArray[0];
                const providerArray = secondArray.map(x => x.providers);
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
            } catch (err) {
                console.log('Error in the IF CLAUSE!', err);
            }
        }
    } catch (err) {
        console.log('Error in the general try-catch', err);
    }
};

module.exports = {
    get
};