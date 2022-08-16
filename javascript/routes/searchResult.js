"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const searchResult_controller_1 = __importDefault(require("../controllers/searchResult.controller"));
exports.default = router.get('/', searchResult_controller_1.default.getSearchResult);
