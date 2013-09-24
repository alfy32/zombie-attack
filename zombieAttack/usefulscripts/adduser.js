
exports.addUser = function(bcrypt,usersdb,user){

	//need to add checks to see if the user already exists
	   bcrypt.hash(user.password,null,null , function(err, hash) {
	   	user.password = hash;
    	usersdb.save(user.email,user,function(err,res){
    		if(err)
    			console.log('failed to create user' + user.email);
    		else
    			console.log('successfully created user' + user.email);
    	});

    	});
	};


exports.newUserRequest = function(bcrypt, request_db, user,responder){

	//need to add checks to see if the user has already requested an account or
	//already has one
	bcrypt.hash(user.password,null,null , function(err, hash) {
	   	user.password = hash;
    	request_db.save(user.email,user,function(err,res){
    		if(err){
    			console.log('failed to submit' + user.email);
    		}
    		else
    		{
    			console.log('successfully created user' + user.email);
	    		var response = Object();
	    		response.result = "Success";
	    		responder.json(response);
    		}
    	});

    });
};
