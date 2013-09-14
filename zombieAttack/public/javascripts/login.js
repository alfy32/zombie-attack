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
				if(data.result =="Success"){
					loadDiv('#user-info','userinfo.html');
					loadDiv('#load-stuff-here','main.html')
				}
			});
		});
	}
	
	return {init:init};
});

function loadDiv(htmlTag,url){
	$.ajax(
		{type:"GET", 
		url:url
	}).
	done(function(htm){
		$(htmlTag).html(htm);
	});
}
