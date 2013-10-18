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
                    loadMainPage();
                }
            });
        //$('#load-stuff-here').fadeOut(1000);
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

        $('#new-request-submit-btn').click(function(){
            var fail = false;
            console.log('new user request pressed')
            var password = $('#new-request-password');
            var passwordVerify = $('#new-request-password-verify');
            var email = $('#new-request-email');
            var name = $('#new-request-name');

            if(password.val() != passwordVerify.val())
            {

                //make the password boxes red
                password.addClass('btn-danger');
                passwordVerify.addClass('btn-danger');
                password.attr('placeholder','Passwords do not match.');
                passwordVerify.attr('placeholder','Passwords do not match.');
                password.val('');
                passwordVerify.val('');
                fail = true;
            }
            else
            {
                password.attr('placeholder','Password');
                passwordVerify.attr('placeholder','Verify Password');
                password.removeClass('btn-danger');
                passwordVerify.removeClass('btn-danger');
            }

            if(password.val().length < 6)
            {
                password.addClass('btn-danger');
                passwordVerify.addClass('btn-danger');
                password.attr('placeholder','Password must be at least 6 character long');
                passwordVerify.attr('placeholder','Password must be at least 6 character long');
                password.val('');
                passwordVerify.val('');
                fail = true;
            }
            else
            {
                password.attr('placeholder','Password');
                passwordVerify.attr('placeholder','Verify Password');
                password.removeClass('btn-danger');
                passwordVerify.removeClass('btn-danger');
            }

            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(email.val()))
            {
                email.val('');
                email.attr('placeholder','Invalid Email');
                email.addClass('btn-danger');
                fail = true;
            }
            else
            {
                email.attr('placeholder','Email');
                email.removeClass('btn-danger');
            }

            if(name.val()=="")
            {
                name.addClass('btn-danger');
                name.attr('placeholder','Must Enter A Name');
                fail = true;
            }
            else
            {
                name.attr('placeholder','Name');
                name.removeClass('btn-danger');
            }

            if(!fail){
                var request = {
                    email : email.val(),
                    name : name.val(),
                    password : password.val()
                    };
            
            $.post("/newuserrequest", request, function(data) {
                console.log(data);
                if (data.result === "Success") {
                    console.log('successfully submitted new user')
                    name.val('');
                    password.val('');
                    passwordVerify.val('');
                    email.val('');
                    $('#new-request-close-btn').trigger('click');
                }
                else if(data.result = "User already exists")
                {
                    console.log("user already exists");
                }
                else
                {
                    console.log("failed to submit new user");
                }
            });

                
            }

        });
    }
    return {init: init};
});

function loadMainPage()
{
    pageName = "main";
    $('#login-form').html("<table><tr><td><button id=\"logout-text\"> Logout </button></td><td><button id=\"userInfo-text\"> UserInfo </button></td></tr></table>");
    bindLogout();
    bindUserInfo();
    $.get("/mapsrequest", {}, function(info) {
        var list = document.getElementById('mainList');
        for(var i = 0; i < info.length; ++i)
        {
            var title = info[i].value.title;
            var entry = document.createElement('a');
            entry.appendChild(document.createTextNode(title));
            entry.setAttribute('class','list-group-item');
            entry.setAttribute('onClick','makeActive(this)');
            entry.setAttribute('style','text-align:center;');
            list.appendChild(entry);
        }                  
    });
    //loadDelay();
    $('#load-stuff-here').load('main.html');
}

function loadDelay()
{
    $('#load-stuff-here').hide();
    $('#load-stuff-here').delay().fadeIn(500);
}

 function bindLogout()
 {
    $('#logout-text').click(function() {
    
    $.post('/logout', {}, function(info)
        {
            
        });
    window.location.href = "/";
    });
    return false;
 }

 function bindUserInfo()
 {
    $('#userInfo-text').click(function() {
        $('#userInfo-text').html("Go Back");
        bindBackToMain();
        $('#load-stuff-here').load('userinfo.html');
        return false;
    });
    
 }
 function bindBackToMain()
 {
    $('#userInfo-text').click(function()
    {
        loadMainPage();    
        return false;  
    });
    return false;
 }
