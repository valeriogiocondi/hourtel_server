'use strict'
const crypto = require('crypto');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = {

	getToken: () => {

		return crypto.randomBytes(50).toString('hex');
	},

	mysqlConnection: (host, user, pass, port, name) => {

		let conn = mysql.createConnection({
		  host     : host,
		  user     : user,
		  password : pass,
		  port : port,
		  database: name
		});
		conn.connect();
		return conn;
	},

	emailer: {

		sendEmail: (to, subject, text) => {

			let adminEmailAddr = '****';
			let adminEmailpass = '****';

			let transporter = nodemailer.createTransport(smtpTransport({
			  service: 'gmail',
  			host: 'smtp.gmail.com',	
			  auth: {
			    user: adminEmailAddr,
			    pass: adminEmailpass
			  }
			}));

			let mailOptions = {
			  from: 'Hourtel.it <'+adminEmailAddr+'>',
			  to: to,
			  subject: subject,
			  html: text
			};

			transporter.sendMail(mailOptions, (err, info) => {

		  	if (err) throw err;
			}); 
		}
	}
};