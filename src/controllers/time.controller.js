const express = require('express');
const axios = require('axios');

const APIToFetch = 'https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices';

async function get(req, res) {
    try {
        const apiRes = await axios.get(APIToFetch);
        validUntil = apiRes.data.validUntil;
        res.json(validUntil);
    } catch (err) {
        console.log('Error!', err);
    }
}

module.exports = {
    get
}