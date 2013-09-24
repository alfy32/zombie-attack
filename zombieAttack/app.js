//random constants and other things
var TIMEOUT = 600000;

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
var bcrypt = require('bcrypt-nodejs');

var userFunctions = require('./usefulscripts/adduser');

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
app.use(checkAuth);
app.use(express.static(path.join(__dirname, 'private')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//setup the users database//

//uncoment the next three lines if you want to use a remote database
 var connection = new(cradle.Connection)('http://zombie.cloudant.com',5984,
 			{auth:{username:'zombie',password:'eatbrains'}});
 // var users = connection.database('users');

//uncoment this line if you want to use the local database
var users = new(cradle.Connection)().database('users');
var userRequests_db = new(cradle.Connection)().database('user_requests');

app.post('/', function(req,res)
{
	var id = req.body.email;
	var pass = req.body.password;
	var response = Object();
	response.result = "fail";

	users.get(id, function(err,doc){
		if(err){
			console.log("failed to get user from database");
			response.result = "Invalid userName or password";
			res.json(response);
		}
		else{
			var newhash=doc.password;
			bcrypt.compare(pass,newhash,function(err,result){
				if(err){
					console.log('failed to compare');
					response.result = "Invalid userName or password";
					res.json(response);
				}

				if(result){
					console.log("successfully authenticated " + doc._id);
					req.session.user = doc;
					req.session.lastActivity = new Date().getTime();
					response.result = "Success";
                    response.user = req.body.email;
					res.json(response);
				}

			});
		}
	});

});

app.get('/secret',checkAuth,function(req,res){
	res.send('you are authorized');
});

app.get('/logout', function(req,res){
	delete req.session.user;
	delete req.session.lastActivity;
	res.redirect('/');
});

app.post('/newuserrequest',function(req,res){
	console.log(req.body);
	userFunctions.newUserRequest(bcrypt,userRequests_db,req.body,res);
});

app.post('/createUser',checkAuth, function(req,res){
	var user = new Object();
	user['name'] = req.body.name;
	user['password']= req.body.password;
	user['email']=req.body.email;
	userFunctions.adduser(bcrypt,users,user);
	res.send('<h1>success<h1>');
});


function checkAuth(req, res, next) {
	var lastActivity = new Date().getTime() - req.session.lastActivity;
	console.log(lastActivity);
  if (!req.session.user) {
  	console.log(lastActivity);
  
    res.send('You are not authorized to view this page');
  } 
  else {
  	if(lastActivity>TIMEOUT)
  	{
  		delete req.session.user;
  		delete req.session.lastActivity;
  		res.send('you have been logged out due to innactivity, please login again');

  	}
  	else
  	{
  		req.session.lastActivity = new Date().getTime();
		next();
	}
  }
}



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
