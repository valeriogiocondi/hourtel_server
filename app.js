'use strict'
const express = require('express');
const app = express();

const hotel = require('./components/modules/hotel-profile.js');
const login = require('./components/modules/login.js');
const logout = require('./components/modules/logout.js');
const registration = require('./components/modules/registration.js');
const hotelsByMap = require('./components/modules/hotelsByMap.js');

const loginVerification = require('./components/services/login/verification.js');

app.use('/hotel', hotel);
app.use('/login', login);
app.use('/logout', logout);
app.use('/registration', registration);
app.use('/login-verification', loginVerification);
app.use('/lista-hotel-by-map', hotelsByMap);

app.listen(3001);