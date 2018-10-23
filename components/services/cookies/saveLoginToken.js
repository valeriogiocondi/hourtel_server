'use strict'
const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(cors());


router.get('/id/:id/token/:token', function(req, res) {

	req.session.userInfo = {id: req.params.id, token: req.params.token};

  // res
  // .cookie('userInfo', '{id:'+req.params.id+', token:\''+req.params.token+'\'}')
  // .json({response: 'ok', description: 'Token salvato'});

  console.log('Token salvato {id:'+req.params.id+', token:\''+req.params.token+'\'}');
  console.log('Cookies: ', req.session.userInfo);


});

module.exports = router;
