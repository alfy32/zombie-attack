define(["login"], function(login) {
	login.init();
        
        $('#login-email').focus();
});

function makeActive(tableItem)
{
	var tableElements = document.getElementsByClassName('list-group-item active');
	for (var i = 0; i < tableElements.length; ++i)
	{
		tableElements[i].className = "list-group-item";
	}
	tableItem.className = "list-group-item active";
}

function startMap(item)
{
	makeActive(item);
	pageName = "editor";
	//loadDelay();
	$('#load-stuff-here').load('mapEditor.html');
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
	console.log(mapID);
	var request = {
		mapid : $(mapID).attr('mapid')
	};
	$.post("/playMap", request, function(info)
	{
		console.log(info);
		$(".play-area").attr('src',info.url);
	});
	console.log("play");
}

function editMap()
{
	console.log("edit");
}

function deleteMap()
{
	console.log("delete");
}