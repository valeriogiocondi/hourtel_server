'use strict'
const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const config = require('../../config.js');
const lib = require('../../library.js');

router.use(bodyParser.json());
router.use(cors());


router.get('/id/:id/token/:token', function(req, res) {

	let user;
	let token;
  let mysqlConn;
  let query;

	user = req.params.id;
	token = req.params.token;

	mysqlConn = lib.mysqlConnection(config.database.host, config.database.user, config.database.pass, config.database.port, config.database.name);
  query = 'SELECT token, token_expired_date FROM '+config.database.prefix+'customers_login WHERE customer = '+user+' AND token = "'+token+'"';
  // res.send(query);
	mysqlConn.query(query, (err, rows, fields) => {
		
		if (err) throw err;

		if (rows.length > 0) {

			if (token === rows[0].token && new Date(rows[0].token_expired_date) > new Date())
		  		res.json({response: 'ok', description: 'Login valido'});
			else
		  		res.json({response: 'err', description: 'Login scaduto'});
		}

	});

});

module.exports = router;