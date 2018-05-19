module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// pulls the place data from the db
	function getPlaces(res, mysql, context, complete){
		mysql.pool.query('SELECT id, name FROM lotr_place', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.places = results;
			complete();
		});
	};

	// pulls the race data from the db
	function getRaces(res, mysql, context, complete){
		mysql.pool.query('SELECT id, name FROM lotr_race', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end()
			}
			context.races = results;
			complete();
		});
	};

	// pulls character data from the db along with place names and race names
	// corresponding to each character
	function getCharacters(res, mysql, context, complete){
		mysql.pool.query('SELECT lotr_character.id, first_name, last_name, lotr_place.name AS homeland, lotr_race.name AS race FROM lotr_character LEFT JOIN lotr_place ON lotr_character.place_id = lotr_place.id INNER JOIN lotr_race ON lotr_character.race_id = lotr_race.id', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.characters = results;
			complete();
		});
	};

	//brings up characters page
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//context.jsscripts = ['deleteperson.js']; WILL IMPLEMENT LATER
		var mysql = req.app.get('mysql');
		getCharacters(res, mysql, context, complete);
		getPlaces(res, mysql, context, complete);
		getRaces(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('characters.handlebars', context);
			}
		}
	});

	//adds a character to the db, and redirects back to the character page

	router.post('/', function(req, res){
		if(req.body.place_id == 'NULL'){
			req.body.place_id = null;
		}
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO lotr_character (first_name, last_name, place_id, race_id) VALUES (?,?,?,?)';
		var inserts = [req.body.first_name, req.body.last_name, req.body.place_id, req.body.race_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/characters');
			}
		});
	});

	router.get('/1', function(req, res){
		res.render('update_character.handlebars');
	});

	return router;

}();