 $('#login-email').focus();

function loadMainPage()
{
    pageName = "main";
    $('#login-form').html("<table><tr><td><button id=\"logout-text\"> Logout </button></td><td><button id=\"userInfo-text\"> UserInfo </button></td></tr></table>");
    bindLogout();
    bindUserInfo();
    

    $('#load-stuff-here').load('main.html',function(){
        $.get("/currentuser", {}, function(info)
        {
            var tr = $("<tr>");
            if(info.player)
            {
                $(tr).append('<td><button href="#play-map-modal" data-toggle="modal" onclick="playMap()">PLAY</button></td>');
            }
            if(info.designer)
            {
                $("#mainList").append('<a class="list-group-item" onmouseover="" href="#make-map-modal" data-toggle="modal" style="text-align:center;"><span class="glyphicon glyphicon-plus"></span></a>');
                $(tr).append('<td><button onclick="editMap()">EDIT</button></td>');
            }
            if(info.admin)
            {
                $(tr).append('<td><button onclick="deleteMap()">DELETE</button></td>');
            }
            $("#load-table").append(tr);
            $.get("/mapsrequest", {}, function(info) {
                var list = document.getElementById('mainList');
                for(var i = 0; i < info.length; ++i)
                {
                    var title = info[i].value.title;
                    var id = info[i].id;
                    var entry = document.createElement('a');
                    entry.appendChild(document.createTextNode(title));
                    entry.setAttribute('class','list-group-item');
                    entry.setAttribute('onClick','makeActive(this)');
                    entry.setAttribute('style','text-align:center;');
                    list.appendChild(entry);
                    $(entry).data(info[i].value);
                }        
            });
        });
    });
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
        loadUserInfo();
        return false;
    });  
 }

 function makeActive(tableItem)
{
	var tableElements = document.getElementsByClassName('list-group-item active');
	$('.active').attr('class','list-group-item');
	tableItem.className = "list-group-item active";
    drawMap('canvas', spriteImage, $(tableItem).data());
}

function startMap(id)
{
	pageName = "editor";
        mapId = id;
	newMapModal();
	$('#load-stuff-here').load('mapEditor.html');
}

function newMapModal()
{

}

function refreshMapEditor()
{
	pageName = "editor";
	loadDelay();
	$('#load-stuff-here').load('mapEditor.html');
}

function loadStartup()
{
	if(pageName === "home")
	{

	}
	else
	{
		pageName = "home";
		loadDelay();
		$('#load-stuff-here').load('startup.html');
	}
}

function playMap()
{
    var mapID = $(".active").data("_id");
        $(".modal-title").html($(".active").data("title"));
        console.log(mapID);
        var request = {
                mapid : mapID
        };
        $.post("/playMap", request, function(info)
        {
                console.log(info);
                $(".play-area").attr('src',info.url);
                $(".play-area").focus();
        });
        console.log("play");
        /*
	var mapID = $("#mainList .active").attr('mapid');
    var mapHeight = $('#mainList .active').attr('mapHeight');
    var mapWidth = $('#mainList .active').attr('mapWidth');
	$('#load-stuff-here').load('playmap.html', function(){
		var request = {
			mapid : mapID
		};
		$.post("/playMap", request, function(info)
		{
			console.log(info);
			$(".play-area").attr('src',info.url);
            $(".play-area").attr('height',mapHeight*40 + 10);
            $(".play-area").attr('width',mapWidth*40 + 10);
            $(".play-area").focus();
			console.log(info.url, " loaded");
		});
		console.log("play");
	});
 */
}

function editMap()
{
    startMap($('.active').attr('mapid'));
}

function deleteMap()
{
	console.log("delete");
}

/*
$('#make-map-submit-btn').click(function(){
	$('.modal-backdrop').click();
	setTimeout(function(){
    	startMap();
	}, 500);
});
*/

$('#make-map-submit-btn').click(function() {
    var fail = false;
    console.log('make map button pressed');
    var name = $('#new-map-name');
    var height = $('#new-map-height');
    var width = $('#new-map-width');

    var re = /[0-9]+/;
    if (!re.test(height.val()))
    {
        height.val('');
        height.attr('placeholder', 'Invalid Height');
        height.addClass('btn-danger');
        fail = true;
    }
    else
    {
        height.attr('placeholder', 'Height');
        height.removeClass('btn-danger');
    }

    if (!re.test(width.val()))
    {
        width.val('');
        width.attr('placeholder', 'Invalid Width');
        width.addClass('btn-danger');
        fail = true;
    }
    else
    {
        width.attr('placeholder', 'Width');
        width.removeClass('btn-danger');
    }

    if (name.val() === "")
    {
        name.addClass('btn-danger');
        name.attr('placeholder', 'Must Enter A Name');
        fail = true;
    }
    else
    {
        name.attr('placeholder', 'Name');
        name.removeClass('btn-danger');
    }

    if (!fail) {
        var request = {
        };

/*
        $.post("/newuserrequest", request, function(data) {
            if (data.result === "Success") {
                console.log('successfully submitted new user')
                name.val('');
                password.val('');
                passwordVerify.val('');
                email.val('');
                $('#new-request-close-btn').trigger('click');
            }
            else if (data.result === "User already exists")
            {
                console.log("user already exists");
            }
            else
            {
                console.log("failed to submit new user");
            }
        });
*/

    }

});
