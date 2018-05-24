module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// pulls the place data from the db
	function getPlaces(res, mysql, context, complete){
		mysql.pool.query('SELECT id, name, place_located_in.parent_name AS located_in FROM lotr_place LEFT JOIN (SELECT parent_query.parent_place_id, parent_query.child_place_id, parent_query.parent_name, lotr_place.name AS child_name FROM  (SELECT child_place_id, parent_place_id, lotr_place.name AS parent_name FROM lotr_place_located_in INNER JOIN lotr_place ON parent_place_id = id) AS parent_query INNER JOIN lotr_place ON parent_query.child_place_id = id) AS place_located_in ON place_located_in.child_place_id = lotr_place.id', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.places = results;
			complete();
		});
	};

	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ['delete_place.js'];
		var mysql = req.app.get('mysql');
		getPlaces(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('places.handlebars', context);
			}
		}
	});

	return router;
}();