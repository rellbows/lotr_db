module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// get characters to populate in dropdown list
	function getCharacters(req, mysql, context, complete){
		mysql.pool.query('SELECT id, first_name, last_name FROM lotr_character', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.characters = results;
			complete();
		});
	}

	// get weapons to populate in dropdown list
	function getWeapons(req, mysql, context, complete){
		mysql.pool.query('SELECT id, name, power FROM lotr_weapon', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.weapons = results;
			complete();
		})
	}

	// get characters and thier weapons
	function getCharactersWithWeapons(res, mysql, context, complete){
		sql = "SELECT character_id, weapon_id, CONCAT(first_name, ' ', IFNULL(last_name, '')) AS char_name, lotr_weapon.name AS weapon_name, lotr_weapon.power FROM lotr_character_weapon INNER JOIN lotr_character ON lotr_character_weapon.character_id = lotr_character.id INNER JOIN lotr_weapon ON lotr_character_weapon.weapon_id = lotr_weapon.id ORDER BY char_name, weapon_name";
		mysql.pool.query(sql, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.characters_with_weapons = results;
			complete();
		});
	}

	function getCharacterWithWeapons(res, mysql, context, id, complete){
		sql = "SELECT character_id, weapon_id, CONCAT(first_name, ' ', IFNULL(last_name, '')) AS char_name, lotr_weapon.name AS weapon_name, power FROM lotr_character_weapon INNER JOIN lotr_character ON lotr_character_weapon.character_id = lotr_character.id INNER JOIN lotr_weapon ON lotr_character_weapon.weapon_id = lotr_weapon.id WHERE lotr_character_weapon.character_id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.character_with_weapons = results;
			complete();
		});
	};

	// gets specific character/weapon instance
	function getCharacterWithWeapon(res, mysql, context, character_id, weapon_id, complete){
		sql = "SELECT character_id, weapon_id, CONCAT(first_name, ' ', IFNULL(last_name, '')) AS char_name, lotr_weapon.name AS weapon_name, power FROM lotr_character_weapon INNER JOIN lotr_character ON lotr_character_weapon.character_id = lotr_character.id INNER JOIN lotr_weapon ON lotr_character_weapon.weapon_id = lotr_weapon.id WHERE lotr_character_weapon.character_id = ? AND lotr_character_weapon.weapon_id = ?";
		var inserts = [character_id, weapon_id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			console.log(results);
			context.character_with_weapon = results[0];
			complete();
		});
	};

	function getCharacterName(res, mysql, context, id, complete){
		sql = "SELECT id, CONCAT(first_name, ' ', IFNULL(last_name, '')) AS char_name FROM lotr_character WHERE id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.character_name = results[0];
			complete();
		});
	};

	// list characters with weapons and form for adding new character/weapon
	// relationships
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ['delete_character.js'];
		var mysql = req.app.get('mysql');
		getCharacters(res, mysql, context, complete);
		getWeapons(res, mysql, context, complete);
		getCharactersWithWeapons(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('characters_weapons.handlebars', context);
			}
		}
	});

	router.post('/search_character_with_weapons', function(req, res){
		var mysql = req.app.get('mysql');
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ['delete_character.js'];
		getCharacterWithWeapons(res, mysql, context, req.body.character_id, complete);
		getCharacterName(res, mysql, context, req.body.character_id, complete);
		console.log(context.character_name)
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('search_character_with_weapons.handlebars', context);
			}
		}
	});

	// update character/weapon page
	router.get('/:character_id/:weapon_id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ['select_weapon.js', 'update_character.js'];
		var mysql = req.app.get('mysql');
		getCharacterWithWeapon(res, mysql, context, req.params.character_id, req.params.weapon_id, complete);
		getCharacterName(res, mysql, context, req.params.character_id, complete);
		getWeapons(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('update_character_weapon.handlebars', context);
			}
		};
	});

	// updates a character/weapon relation
	router.put('/:character_id/:weapon_id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'UPDATE lotr_character_weapon SET weapon_id=? WHERE character_id=? AND weapon_id=?';
		var inserts = [req.body.weapon_id, req.params.character_id, req.params.weapon_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.status(200);
				res.end();
			}
		});
	});

	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var character_id = req.body.character_id;
		var weapon_id = req.body.weapon_id;
		var sql = 'INSERT INTO lotr_character_weapon (character_id, weapon_id) VALUES (?, ?)';
		var inserts = [character_id, weapon_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.redirect('/characters_weapons');
			}
		});
	});

	router.delete('/character_id/:character_id/weapon_id/:weapon_id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM lotr_character_weapon WHERE character_id = ? AND weapon_id = ?';
		var inserts = [req.params.character_id, req.params.weapon_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}
			else{
				res.status(202).end();
			}
		});
	});

	return router;
}();