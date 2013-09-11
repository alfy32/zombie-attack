
define([], function () {

function init () {

	$('#form-login-button').click(function(){
		console.log('intercepted the post');

		var formdata = {'email':$('#login-email').val(),
						'password':$('#login-password').val()};
		// var formdata['email'] = $('#login-email').val();
		// var formdata['password'] = $('#login-password').val();
		console.log(formdata);
		$.post("/", formdata, function(data){
			if(data.result =="Success")
			{
				loadWelcome();
			}

		});
	});
}

return {init:init};
});

function loadWelcome(){
	$.ajax(
		{type:"GET", 
		url:"userinfo.html"
	}).
	done(function(htm){
		$("#user-info").html(htm);
	});
}


// function showNewUserModal()
// {
// 	console.log("I work!!!!");
// }
