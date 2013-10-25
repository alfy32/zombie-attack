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
var request = require('request');
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

var connection = new(cradle.Connection)('apt7r.us',3005,
 			{auth:{username:'zombie',password:'eatbrains'}});
var users = connection.database('users');
var userRequests_db = connection.database('user_requests');
var maps = connection.database('maps');


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

//done
app.get('/currentuser', /*checkauth,*/ function(req,res){
	console.log("getting current user");
	res.json(req.session.user);
});

// ------------ MAP REQUESTS --------------- //
app.post('/map', checkAuth, function(req, res) {
	var map = req.body.map;

	console.log(map);
	maps.save(map, function(err,res){
		var p = Object();
		if(err)
		{
			p.result = "failed to save map";
		}
		else
		{
			p.result = "Map Saved successfully"
		}
	res.json(p);
	});


});

app.get('/map', checkAuth, function(req, res) {

	res.json({
		result: 'this get request is not yet implemented.',
		maps: [] //returns a list of all maps in database that user has access to.
	});
});

app.get('/map/:id?', checkAuth, function(req, res) {
	var mapId = req.route.params.id;

	res.json({
		result: 'this get request is not yet implemented.',
		map: {}// returns the map with the id given in the url.
	});
});

app.post('/mapImage', checkAuth, function(req, res) {
	var mapImage = req.body.mapImage;

	// TODO: implement 
	
	//this will require a map image database. It would need simply the mapId and the image.

	res.json({
		result: 'this post request is not yet implemented.'
	});
});

app.get('/mapImage', checkAuth, function(req, res) {

	res.json({
		result: 'this get request is not yet implemented.',
		mapImages: [] //returns a list of all maps in database that user has access to.
	});
});

app.get('/mapImage/:id?', checkAuth, function(req, res) {
	var mapId = req.route.params.id;

	res.json({
		result: 'this get request is not yet implemented.',
		mapImage: {} // returns the map with the id given in the url.
	});
});

//done
app.post('/playMap', checkAuth, function(req, res){

	var mapId = req.body.mapid; 
	console.log(mapId);

	maps.get(mapId,function(error, doc){
		if(error){
			console.log("error requesting map: " + mapId);
			res.send("failure")
		}
		else{
			delete doc._id;
			delete doc._rev;

			var options = {

				method: 'POST',
				url:"http://zombie-attack.aws.af.cm/uploadMap/d7f073fb-55c8-91bf-4d63-b65268a626d4",
				json: {map:doc}
			};
			request(options, function(err, resp, body){
				res.send(body);
			});
		}
	});
});

// ------------------------------------------ //


app.get('/mapsrequest', checkAuth, function(req, res){
	maps.get('_design/company/_view/all', function(error, response){
		if(error)
			console.log('error requesting maps');
		else
		{
			console.log("successfully retrievd maps");
			res.json(response);
		}
	});
});

app.get('/users', /*checkAuth,*/function(req,res){
	users.get('_design/company/_view/all', function(error, response){
		if(error)
		{
			console.log('error requesting users')
		}
		else
		{
			console.log('successfully retrieved users');
			res.json(response);
		}
	});
});

//done
app.get('/logout', function(req,res){
	delete req.session.user;
	delete req.session.lastActivity;
	res.redirect('/');
});


//done
app.post('/newuserrequest',function(req,res){
	console.log(req.body);
	userFunctions.newUserRequest(bcrypt,userRequests_db,req.body,res);
});

//done
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
	//console.log(lastActivity);
  if (!req.session.user) {
  	//console.log(lastActivity);
  
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
