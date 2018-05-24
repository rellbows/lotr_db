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

	function getPlace(res, mysql, context, id, complete){
		var sql = 'SELECT id, name FROM lotr_place WHERE lotr_place.id = ?';
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.place = results[0];
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

	router.post('/', function(req, res){
		var callbackCount = 0;
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO lotr_place (name) VALUES (?)';
		inserts = [req.body.name];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.redirect('/places');
			}
		});
	});

	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ['update_place.js'];
		var mysql = req.app.get('mysql');
		getPlace(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update_place.handlebars', context);
			}
		}
	});

	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'UPDATE lotr_place SET name=? WHERE id=?';
		var inserts = [req.body.name, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.status(200);
				res.end();
			};
		});
	});

	return router;
}();