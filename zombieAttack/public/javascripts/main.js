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

function mapEditor() {
	$('#load-stuff-here').load('mapEditor.html');
define(["login"], function (login){
    login.init();
});

function startMap()
{
	$('#load-stuff-here').load('mapEditor.html');
}