
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
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//setup the users database

var users = new(cradle.Connection)().database('users');

//app.get('/', routes.index);
// app.get('/users', user.list);

app.post('/', function(req,res)
{
	var id = req.body.email;
	var pass = req.body.password;
	verify(id,pass,res);

});
app.post('/createUser',function(req,res){
	var user = new Object();
	user['name'] = req.body.name;
	user['password']= req.body.password;
	user['email']=req.body.email
	adduser.new(bcrypt,users,user);
	res.send('<h1>success<h1>');
});


function verify(id,pass,res)
{
	console.log(id);
	console.log(pass);
	users.get(id, function(err,doc){
		if(err)
		{
			console.log("failed to get user from database");
			res.redirect('/');
		}
		else{
			var newhash=doc.password;
			console.log(doc);
			bcrypt.compare(pass,newhash,function(err,result){
				if(err){
					console.log('failed to compare');
					res.redirect('/');
				}

				if(result){
					res.redirect('/loginSuccess.html');
				}
				else{
					res.redirect('/');
				}
			});



			// if(newpass==pass)
			// {
			// 	console.log('success');
			// 	res.redirect('/loginSuccess.html');
			// }
			// else
			// {
			// 	res.redirect('/');
			// }
		}
	});
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
