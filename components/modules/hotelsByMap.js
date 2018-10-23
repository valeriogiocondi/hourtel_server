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

router.get('/:topleft/:topright/:bottomright/:bottomleft/', jsonParser, function(req, res) {

	let topleft = req.params.topleft;
	let topright = req.params.topright;
	let bottomright = req.params.bottomright;
	let bottomleft = req.params.bottomleft;
  let mysqlConn;
  let query;

	mysqlConn = lib.mysqlConnection(config.database.host, config.database.user, config.database.pass, config.database.port, config.database.name);
	query = 'SELECT t1.id, t1.name, t1.profile_picture, t1.address_street, t1.address_number, t1.zip_code, t1.latitude, t1.longitude, t2.type FROM '+config.database.prefix+'hotels t1, '+config.database.prefix+'hotel_types t2 WHERE ST_CONTAINS(ST_GEOMFROMTEXT(\'POLYGON(('+topleft+', '+topright+', '+bottomright+', '+bottomleft+', '+topleft+'))\'), POINT(t1.latitude, t1.longitude)) AND t1.type = t2.id AND t1.is_hotel = 1 AND t1.online = 1;';
	mysqlConn.query(query, (err, rows, fields) => {
		
	  if (err) throw err;

		mysqlConn.end();

		rows.forEach((val) => {

  		val.profile_picture === '' ? val.profile_picture = config.client.hostname+config.client.imagesHotelPath : val.profile_picture = config.client.hostname+config.client.imagesHotel+val.profile_picture;
		});
	  
		res.send(rows);
	});
});

module.exports = router;