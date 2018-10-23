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

router.get('/:id', jsonParser, function(req, res) {

    let mysqlConn;
    let query;
    let hotel = {};

		mysqlConn = lib.mysqlConnection(config.database.host, config.database.user, config.database.pass, config.database.port, config.database.name);
 		query = 'SELECT *, t2.id AS city_id, t2.name AS city_name, t2.url AS city_url, t3.id AS type_id, t3.type AS type_name, t3.url AS type_url, t1.id, t1.name FROM '+config.database.prefix+'hotels t1, '+config.database.prefix+'cities t2, '+config.database.prefix+'hotel_types t3 WHERE t1.id = '+req.params.id+' AND t1.online = 1 AND t1.city = t2.id AND t1.type = t3.id GROUP BY t1.id';

		mysqlConn.query(query, (err, rows, fields) => {
			
		  if (err) throw err;

		  hotel = rows[0];

			query = 'SELECT * FROM '+config.database.prefix+'hotels_to_images WHERE hotel = '+req.params.id+' AND online = 1 AND approved = 1 ORDER BY position';
			mysqlConn.query(query, (err, rows, fields) => {

		  	mysqlConn.end();

		  	rows.forEach((val) => {

		  		val.image = config.client.hostname+config.client.imagesHotel+val.image;
		  	});

		  	hotel.images = rows;
		  	res.json(hotel);
			});


		});
});

module.exports = router;