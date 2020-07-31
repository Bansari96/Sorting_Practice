const express = require('express')
const SortingRoute = express.Router();

SortingRoute.route('/').get(() => console.log("Works"));

module.exports.route = SortingRoute;