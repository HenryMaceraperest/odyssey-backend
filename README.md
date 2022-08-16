# The code for Cosmos-Odyssey backend

The main api endpoints are '/time' for getting the "validUntil" datetime, '/routes' to get an array with all the current direct-flight routes, 
and '/searchresult?from={value1}&to={value2}&date={yyyy-mm-dd}'. For the latter, the date value is optional.

## Available Script

### npm start dev
For typescript development testing.

### npm start build
For typescript to build based on 'tsconfig.json', "/src" typescript files, into the folder "/javascript"

Open [http://localhost:4000](http://localhost:4000) to view it in your browser.
