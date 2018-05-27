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
		sql = "SELECT character_id, weapon_id, CONCAT(first_name, ' ', IFNULL(last_name, '')) AS char_name, lotr_weapon.name AS weapon_name, lotr_weapon.power FROM lotr_character_weapon LEFT JOIN lotr_character ON lotr_character_weapon.character_id = lotr_character.id INNER JOIN lotr_weapon ON lotr_character_weapon.weapon_id = lotr_weapon.id ORDER BY char_name, weapon_name";
		mysql.pool.query(sql, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.characters_with_weapons = results;
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
		})
	})

	return router;
}();