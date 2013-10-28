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
    });
    $.get("/mapsrequest", {}, function(info) {
        var list = document.getElementById('mainList');
        for(var i = 0; i < info.length; ++i)
        {
            var title = info[i].value.title;
            var id = info[i].id;
            var entry = document.createElement('a');
            entry.appendChild(document.createTextNode(title));
            entry.setAttribute('mapId',id);
            entry.setAttribute('class','list-group-item');
            entry.setAttribute('onClick','makeActive(this)');
            entry.setAttribute('style','text-align:center;');
            list.appendChild(entry);
        }        
    });
            } );
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
	for (var i = 0; i < tableElements.length; ++i)
	{
		tableElements[i].className = "list-group-item";
	}
	tableItem.className = "list-group-item active";
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
	var mapID = document.getElementsByClassName('list-group-item active');
	$(".modal-title").html($(mapID).html());
	var request = {
		mapid : $(mapID).attr('mapid')
	};
	$.post("/playMap", request, function(info)
	{
		$(".play-area").attr('src',info.url);
	});
	console.log("play");
}

function editMap()
{
    startMap($('.active').attr('mapid'));
}

function deleteMap()
{
	console.log("delete");
}

$('#make-map-submit-btn').click(function(){
	$('.modal-backdrop').click();
	setTimeout(function(){
    	startMap();
	}, 500);
});
