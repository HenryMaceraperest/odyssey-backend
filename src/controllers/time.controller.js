const express = require('express');
const axios = require('axios');

const APIToFetch = process.env.ROOT_API;

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