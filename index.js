const express = require('express');
const app = express();

var home = require('modules/home.js');
// var hotel = require('modules/hotel.js');


app.use('/', home);
// app.use('/hotel', hotel);

