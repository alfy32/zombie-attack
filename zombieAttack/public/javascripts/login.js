define([], function() {

    function init() {

        $('#form-login-button').click(function() {

            var formdata = {
                email: $('#login-email').val(),
                password: $('#login-password').val()
            };

            $('#login-form').html('<p>Loading...</p>').css('color', 'white');

            $.post("/", formdata, function(data) {
                console.log(data);
                if (data.result === "Success") {
                    $('#login-form').html("<p>" + data.user + "</p>");

                    $('#load-stuff-here').load('main.html');
                    fag = "main";

                }
            });
        });

        $("#login-email").keyup(function(e) {
            if (e.which === 13) {
                $('#form-login-button').click();
            }
        });

        $("#login-password").keyup(function(e) {
            if (e.which === 13) {
                $('#form-login-button').click();
            }
        });
    }

    return {init: init};
});
