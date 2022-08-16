# The code for Cosmos-Odyssey backend

The main api endpoints are '/time' for getting the "validUntil" datetime, '/routes' to get an array with all the current direct-flight routes, 
and '/searchresult?from={value1}&to={value2}&date={yyyy-mm-dd}'. For the latter, the date value is optional.

All the endpoints return .json data. For the "/searchresult" the date variable sets the starting date of {value1}, then uses Dijkstra's algorithm to return all possible flights that start from {value1} and reach {value2}, accounting for the flightStart dates and flightEnd dates. For the flight result it runs Dijkstra's for each flight starting from {value1} on the date value. For each iteration, the algorithm finds the shortest flight possible, and then removes the starting "edge". Without the date value, Dijkstra's is run for each flight that starts from {value1} and that reaches {value2}, and then the starting "edge" is removed.

## Available Script

### npm start dev
For typescript development testing.

### npm start build
For typescript to build based on 'tsconfig.json', "/src" typescript files, into the folder "/javascript"

Open [http://localhost:4000](http://localhost:4000) to view it in your browser.
