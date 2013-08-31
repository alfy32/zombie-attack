
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var cradle = require('cradle');
var bcrypt = require('bcrypt');

var adduser = require('./usefulscripts/adduser');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('zombiesarefun'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//setup the users database

var connection = new(cradle.Connection)('http://gdaniels13.iriscouch.com',5984,
	{auth:{username:'zombie',password:'eatbrains'}});
var users = connection.database('users');

//app.get('/', routes.index);
// app.get('/users', user.list);

app.post('/', function(req,res)
{
	var id = req.body.email;
	var pass = req.body.password;
	verifyUser(id,pass,req,res);

});

app.get('/secret',checkAuth,function(req,res){
	res.send('you are authorized');
})

app.post('/createUser',checkAuth, function(req,res){
	var user = new Object();
	user['name'] = req.body.name;
	user['password']= req.body.password;
	user['email']=req.body.email
	adduser.new(bcrypt,users,user);
	res.send('<h1>success<h1>');
});


function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

function verifyUser(id,pass,req,res)
{
	users.get(id, function(err,doc){
		if(err)
		{
			console.log("failed to get user from database");
			res.redirect('/');
		}
		else{
			var newhash=doc.password;
			bcrypt.compare(pass,newhash,function(err,result){
				if(err){
					console.log('failed to compare');
					res.redirect('/');
				}

				if(result){
					req.session.user_id = doc.name;
					res.redirect('/loginSuccess.html');
				}
				else{
					res.redirect('/');
				}
			});
		}
	});
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
