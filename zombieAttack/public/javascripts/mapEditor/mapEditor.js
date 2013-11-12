
function dragStart(e) {

}

function initMap() {
	if (mapId !== undefined) {
		map.setMap({width:0, height:0});
		
    $.get('/map/' + mapId, {}, function(data) {
			map.setMap(data);
      setTitle(data.title);
    });
	}
}

function refresh() {
	clearInterval(interval);
	refreshMapEditor()
}

function back() {
	$('#login-form').show();
	$('#header-buttons').empty();
	loadMainPage();
}

function save() {
	$.post('/map', {map: map.getMap()}, function(data) {
		if(data.result === "success") {
			onSaved();
		} else {
			console.log("Save failed: " + data);
		}
	});
}

function logout() {
	$.get('/logout');

	window.location = '/';
}

function saveCopy() {
	var m = map.getMap();
	m.title += " - Copy";
	delete m._id;
	delete m._rev;
	
	$.post('/map', {map: m}, function(data) {
		if(data.result === "success") {
			m._id = data.mapData.id;
			map.setMap(m);
			onSaved();
		} else {
			console.log("Save failed: " + data);
		}
	});
}

function onSaved() {
	saveTime = new Date();
	setSaveTime();
	map.setChanged(false);
	setTitle(map.getTitle());
}


function bindChecks() {
	$('#CHK-bottom').change(function() {
		map.showLayer('bottom', $('#CHK-bottom').prop('checked'));
	});
	$('#CHK-middle').change(function() {
		map.showLayer('middle', $('#CHK-middle').prop('checked'));
	});
	$('#CHK-upper').change(function() {
		map.showLayer('upper', $('#CHK-upper').prop('checked'));
	});
	$('#CHK-grid').change(function() {
		map.showGrid($('#CHK-grid').prop('checked'));
	});
	$('#CHK-player').change(function() {
		map.showPlayer($('#CHK-player').prop('checked'));
	});
}


function setTitle(title) {
    $("#map-title").val(title);
}

function bindMapTitle() {
	$('#map-title').val(map.getTitle());
	$('#map-title').keyup(function() {
		map.setTitle($('#map-title').val());
	});
}

function bindKeyDown() {
	$(document).unbind("keydown");
	
	$(document).keydown(function(e) {
		switch (e.which) {
			case 37: //left
				map.moveLeft();
				break;
			case 38: //up
				map.moveUp();
				break;
			case 40: //down
				map.moveDown();
				break;
			case 39: //right
				map.moveRight();
				break;
			case 187: //plus
			case 107:
				map.zoomIn();
				break;
			case 189: //minus
			case 109:
				map.zoomOut();
				break;
			case 67: //c
				map.copy();
				break;
			case 86: //v
				map.paste();
				break;
		}
	});
}