module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// TODO get CRUD functionality working for this relationship

	router.get('/', function(req, res){
		res.render('characters_weapons.handlebars')
	});

	return router;
}();