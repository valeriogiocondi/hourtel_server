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

router.post('/', jsonParser, function(req, res) {

	let passRegex;
	let emailRegex;
	let telRegex;

  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
  // passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  telRegex = /^\d+$/;

	if (
		req.body.firstName.length > 0 &&
		req.body.lastName.length > 0 &&
		emailRegex.test(req.body.email) &&
		req.body.tel.length >= 5 &&	
		telRegex.test(req.body.tel)	&&	
		req.body.password.match(passRegex) &&
		req.body.confirmPassword.length > 0 &&
		req.body.password == req.body.confirmPassword
	) 
	{

		req.body.firstName = req.body.firstName.replace(/\b\w/g, function(l){ return l.toUpperCase() });
		req.body.lastName = req.body.lastName.replace(/\b\w/g, function(l){ return l.toUpperCase() });
    req.body.email = req.body.email.toLowerCase().replace(/ /g,'');
    req.body.tel.replace(' ', '');
		
		/*
		*		Creating system with token and him expired date, in order to verify new customer's email address
		*/

    let token;
    let tokenExpiredDate;
    let mysqlConn;
    let query;

    token = lib.getToken();
    tokenExpiredDate = new Date();
		mysqlConn = lib.mysqlConnection(config.database.host, config.database.user, config.database.pass, config.database.port, config.database.name);
	  query = 'SELECT id FROM '+config.database.prefix+'customers WHERE email ="'+req.body.email+'"';
		mysqlConn.query(query, (err, rows, fields) => {
			
		  if (err) throw err;

		  if (rows.length === 0) {

		    tokenExpiredDate.setMinutes(tokenExpiredDate.getMinutes()+30);
		    tokenExpiredDate = tokenExpiredDate.toISOString();
		  	query = 'INSERT INTO '+config.database.prefix+'customers (first_name, last_name, tel, email, password, where_are_you_from, date_of_birth, verify_token, verify_token_expired_date) VALUES ("'+req.body.firstName+'", "'+req.body.lastName+'", "'+req.body.tel+'", "'+req.body.email+'", "'+bcrypt.hashSync(req.body.password, 12)+'", "None", "1970-01-01", "'+token+'", "'+tokenExpiredDate+'")';
		  	
				mysqlConn.query(query, (err, rows, fields) => {
				  	
				  if (err) throw err;
				  
					mysqlConn.end();

				  let url = config.client.hostname+'/verifica-email/token='+lib.getToken();
				  let subject = 'Benvenuto!';
				  let text = '<html>Ciao <b>'+req.body.firstName+'</b><br/><br/>Grazie per esserti registrato!<br/><br/>Conferma il tuo indirizzo e-mail cliccando <a href="'+url+'">su questo link</a>.</html>';

				  // lib.emailer.sendEmail(req.body.email, subject, text);

				  // SET COOKIE 1 year
					// const cookies = new Cookies(req.headers.cookie);
					// cookies.set('user', rows.insertId, { path: '/' });
					// cookies.set('token', token, { path: '/' });

		  		res.json({response: 'ok', description: 'Utente registrato correttamente'});
				});
		  
		  } else {

		  	res.json({response: 'err', description: 'Questa e-mail è già registrata'});
		  }

		});
	  
	}
});

router.get('/:id', function(req, res) {

   res.json(req.params.id);

});

module.exports = router;