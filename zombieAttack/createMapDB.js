
var cradle = require('cradle');

//uncoment the next three lines if you want to use a remote database
 var connection = new(cradle.Connection)('http://zombie.cloudant.com',5984,
 			{auth:{username:'zombie',password:'eatbrains'}});
 var users = connection.database('users');


//uncoment this line if you want to use the local databas

// var users = new(cradle.Connection)().database('user');

// var con = new (cradle.Connection)('localhost',5984,
// 	{auth:{username:'greg',password:'greg'}});


var maps = [{
  title: "sample map",
  author: "dosmun",
  width: 15,
  height: 15,
  x: 4,
  y: 4,
  data: {
    bottom: [
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22, 0, 8,16,22,22,22,22,22,22,22,22,22,22,22],
      [22, 1, 9, 8,16,22,22,22,22,22,22,22,22,22,22],
      [22, 1, 9, 9,17,22,22,22,22,22,22,22,22,22,22],
      [22, 2, 0, 9, 8,16,22,22,22,22,22,22,22,22,22],
      [22,22, 1, 9, 9, 8, 8,16,22,22,22,22,22,22,22],
      [22,22, 2, 4, 9, 9, 9, 8,16,22,22,22,22,22,22],
      [22,22,22, 2,10, 4, 9, 9, 8,16,22,22,22,22,22],
      [22,22,22,22,22, 2, 4, 9, 9,17,22,22,22,22,22],
      [22,22,22,22,22,22, 2, 4, 9,17,22,22,22,22,22],
      [22,22,22,22,22,22,22, 2,10,18,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22]
    ],
    middle:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    top:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  events: [],
  env: "normal"
}];


var map_db = con.database('maps');
map_db.destroy();
map_db.exists(function(err,exists){
	if(err){
		console.log('error',err);
	}
	else if(exists){
		console.log('database exists');
	}
	else
	{
		console.log('creating database and populating it');
		map_db.create()
		for(map in maps){
			map_db.save(maps[map]);
		}
	}
});




