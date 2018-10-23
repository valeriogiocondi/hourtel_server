'use strict'

module.exports = {

	client: {

		hostname: 'http://localhost:3000',
		imageNotAvailable: '/assets/images/image-not-available.png',
		imagesHotel: '/assets/images/hotel/'
	},
	server: {

		hostname: 'http://localhost:3001'
	},

	database: {

		host: 'localhost',
		user: 'root',
		pass: 'ingegneria.123',
		port: '3306',
		name: 'hourtel_database',
		prefix: 'hotels_ore_italy_main_db_'
	}
};