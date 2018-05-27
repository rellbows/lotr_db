// Program Name: LOTR DB App
// Filename: lotr_app.js
// Author: Ryan Ellis
// Description: Main node.js script for the LOTR database web app

// SERVER SIDE CODE

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public')); // where static .js files are served
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.set('mysql', mysql);

//brings up homepage
app.get('/', function(req, res){
	res.render('home.handlebars')
});

//brings up characters page
app.use('/characters', require('./characters.js'));

//brings up weapons page
app.use('/weapons', require('./weapons.js'));

// places page
app.use('/places', require('./places.js'));

// races page
app.use('/races', require('./races.js'));

app.use('/characters_weapons', require('./characters_weapons.js'));

//bad url route
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//bad syntax route
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});