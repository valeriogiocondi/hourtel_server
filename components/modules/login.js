'use strict'
const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const config = require('../config.js');
const lib = require('../library.js');

var jsonParser = bodyParser.json();
router.use(cors(), helmet());

router.post('/', jsonParser, (req, res) => {

  let mysqlConn;
  let query;
  let token = lib.getToken();

  mysqlConn = lib.mysqlConnection(config.database.host, config.database.user, config.database.pass, config.database.port, config.database.name);
  query = 'SELECT id, password, first_name FROM '+config.database.prefix+'customers WHERE email ="'+req.body.email+'"';
  mysqlConn.query(query, (err, rows, fields) => {
    
    if (err) throw err;

    if (rows.length > 0) {

      if (bcrypt.compareSync(req.body.password, rows[0].password)) {

        // Token generation
        let token = lib.getToken();
        let tokenExpiredDate = new Date();
        let firstName = rows[0].first_name;
        let id = rows[0].id;

        tokenExpiredDate.setFullYear(tokenExpiredDate.getFullYear()+1);
        tokenExpiredDate = tokenExpiredDate.toISOString();

        // Save token in database
        query = 'INSERT INTO '+config.database.prefix+'customers_login (customer, userAgent, token, token_expired_date, date_access) VALUES ('+rows[0].id+', "'+req.body.userAgent+'", "'+token+'", "'+tokenExpiredDate+'", "'+new Date().toISOString()+'")';
        mysqlConn.query(query, (err, rows, fields) => {
          
          if (err) throw err;

          mysqlConn.end();

          // Return cookies to client
          res.json({
            response: 'ok', 
            description: 'Ciao '+firstName+'!', 
            user_info: {
              id: id, 
              name: firstName, 
              token: token
            }
          });
        });

      } else {

        // Passwords don't match
        res.json({response: 'err', description: 'Password sbagliata'});
      }
    
    } else
      res.json({response: 'err', description: 'Utente non registrato'});
    
  });

});

module.exports = router;