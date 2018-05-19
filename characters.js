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

	//pull character data for specific character along with place and race names
	// for that character
	function getCharacter(res, mysql, context, id,complete){
		var sql = 'SELECT lotr_character.id, first_name, last_name, place_id, race_id FROM lotr_character WHERE lotr_character.id = ?';
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.character = results[0];
			complete();
		});
	}

	//brings up characters page
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ['delete_character.js'];
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

	//update people page
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ['select_place.js', 'select_race.js', 'update_character.js'];
		var mysql = req.app.get('mysql');
		getCharacter(res, mysql, context, req.params.id, complete);
		getPlaces(res, mysql, context, complete);
		getRaces(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('update_character.handlebars', context);
			}
		}
	});

	//handles information from a update character request
	router.put('/:id', function(req, res){
		if(req.body.place_id == 'NULL'){
			req.body.place_id = null;
		}
		var mysql = req.app.get('mysql');
		var sql = 'UPDATE lotr_character SET first_name=?, last_name=?, place_id=?, race_id=? WHERE id=?';
		var inserts = [req.body.first_name, req.body.last_name, req.body.place_id, req.body.race_id, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				res.status(200);
				res.end();
			}
		});
	});

	//deletes character
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM lotr_character WHERE id=?';
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}
			else{
				res.status(202).end();
			}
		})
	})

	return router;

}();