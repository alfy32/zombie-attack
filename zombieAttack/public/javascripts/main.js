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

function startMap()
{
	$('#load-stuff-here').load('mapEditor.html');
}
