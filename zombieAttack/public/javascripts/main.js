

define(["login"], function(login) {
	login.init();
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
function startMap()
{
	fag = "editor";
	$('#load-stuff-here').load('mapEditor.html');
}

function loadStartup()
{
	if(fag === "home")
	{

	}
	else
	{
		fag = "home";
		$('#load-stuff-here').load('startup.html');
	}
}