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
