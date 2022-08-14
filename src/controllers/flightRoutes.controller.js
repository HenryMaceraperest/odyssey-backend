const express = require('express');
const axios = require('axios');

const APIToFetch = process.env.ROOT_API;

async function get(req, res) {
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
}

module.exports = {
    get
}