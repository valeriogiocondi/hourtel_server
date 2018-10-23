'use strict'
const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const config = require('../config.js');
const lib = require('../library.js');

var jsonParser = bodyParser.json();
router.use(cors(), helmet());

router.post('/', jsonParser, (req, res) => {

  let mysqlConn;
  let query;
  let tokenExpiredDate;

  tokenExpiredDate = new Date();
  tokenExpiredDate = tokenExpiredDate.toISOString();

  mysqlConn = lib.mysqlConnection(config.database.host, config.database.user, config.database.pass, config.database.port, config.database.name);
  query = 'UPDATE '+config.database.prefix+'customers_login SET token_expired_date="'+tokenExpiredDate+'" WHERE customer = '+req.body.id+' AND token = "'+req.body.token+'"';
  // console.log(query);
  mysqlConn.query(query, (err, rows, fields) => {
    
    if (err) throw err;

    res.json({response: 'ok', description: 'Logout effettuato correttamente'});
  });

});

module.exports = router;