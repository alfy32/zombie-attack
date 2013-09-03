$('#login-form').submit(function(){
	console.log('intercepted the post');

	var formdata = {'email':$('#login-email').val(),
					'password':$('#login-password').val()};
	// var formdata['email'] = $('#login-email').val();
	// var formdata['password'] = $('#login-password').val();
	console.log(formdata);
	$.post("/", formdata, function(data){
		if(data.result =="Success")
		{
			$('#login-form').hide();
		}

	});
	return false;
});
