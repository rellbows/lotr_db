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

	return router;

}();