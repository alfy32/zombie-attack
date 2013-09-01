function login(){
	console.log("attempting to login");
	// var path = '/';
	// var params = new Object();
	var usremail = $('#login-email').val();
	var usrpassword= $('#login-password').val();
	// console.log(params);
	// var response=post_to_url(path,params);
	// console.log(response);

	$('#login-form').submit(function(){
		$.ajax({
			type: 'POST',
			url:'/',
			data :{ email: usremail,
					password: usrpassword}

		});
	});
	return false;
}




$('#login-form').submit(function(){
	console.log('intercepted the post');

	var formdata = {'email':$('#login-email').val(),
					'password':$('#login-password').val()};
	// var formdata['email'] = $('#login-email').val();
	// var formdata['password'] = $('#login-password').val();
	console.log(formdata);
	$.post("/", formdata, function(data){
		console.log(data);
	});
	return false;

});

function post_to_url(path, params) {
    method = "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    return form.submit();
}