
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
				$('#login-form').hide();
			}

		});
	});
}

return {init:init};
});


// function showNewUserModal()
// {
// 	console.log("I work!!!!");
// }
