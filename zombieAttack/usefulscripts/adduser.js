
exports.new = function(bcrypt,usersdb,user){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
    	usersdb.save(user.email,{name:user.name,password:hash},function(err,res){
    		if(err)
    			console.log('failed to create user' + user.email);
    		else
    			console.log('successfully created user' + user.email);

    	});

    });
});
};