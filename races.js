module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getRaces(res, mysql, context, complete){
		mysql.pool.query('SELECT id, name, free FROM lotr_race', function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.races = results;
			complete();
		});
	};

	function getRace(res, mysql, id, context, complete){
		var sql = 'SELECT lotr_race.id, name, free FROM lotr_race WHERE lotr_race.id = ?';
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.race = results[0];
			complete();
		});
	};

	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ['delete_race.js'];
		var mysql = req.app.get('mysql');
		getRaces(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('races.handlebars', context);
			}
		}
	});

	router.post('/', function(req, res){
		console.log(req.body)
		if(req.body.free == 'TRUE') {
			req.body.free = true;
		}
		else{
			req.body.free = false;
		}
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO lotr_race (name, free) VALUES (?, ?)';
		var inserts = [req.body.name, req.body.free];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON, stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.redirect('/races');
			}
		});
	});

	//update race page
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ['update_race.js'];
		var mysql = req.app.get('mysql');
		getRace(res, mysql, req.params.id, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update_race.handlebars', context);
			}
		}
	})

	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM lotr_race WHERE id=?';
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
		});
	});

	return router;
}();