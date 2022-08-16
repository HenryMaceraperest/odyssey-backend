"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const axios = require('axios');
const APIToFetch = 'https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices';
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiRes = yield axios.get(APIToFetch);
            result = apiRes.data.legs;
            const allRoutes = [];
            for (let route of result) {
                allRoutes.push(route.routeInfo);
            }
            res.json(allRoutes);
        }
        catch (err) {
            console.log('Error!', err);
        }
    });
}
module.exports = {
    get
};
