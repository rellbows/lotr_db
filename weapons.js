module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// pulls the weapon data from the db
	function getWeapons(res, mysql, context, complete){
		mysql.pool.query('SELECT id, name, power FROM lotr_weapon', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.weapons = results;
			complete();
		});
	};

	function getWeapon(res, mysql, context, id, complete){
		var sql = 'SELECT lotr_weapon.id, name, power FROM lotr_weapon WHERE lotr_weapon.id = ?';
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.weapon = results[0];
			complete();
		});
	};

	// displays the current db and add form
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ['delete_weapon.js'];
		var mysql = req.app.get('mysql');
		getWeapons(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('weapons.handlebars', context);
			}
		};
	});

	// add a weapon
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO lotr_weapon (name, power) VALUES (?,?)';
		var inserts = [req.body.name, req.body.power];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(eror));
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.redirect('/weapons');
			}
		});
	});

	// pulls up the update weapon page
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ['update_weapon.js'];
		var mysql = req.app.get('mysql');
		getWeapon(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('update_weapon.handlebars', context);
			};
		}
	});

	// updates weapon based off data from update weapon page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'UPDATE lotr_weapon SET name=?, power=? WHERE id=?';
		var inserts = [req.body.name, req.body.power, req.params.id];
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

	return router;

}();