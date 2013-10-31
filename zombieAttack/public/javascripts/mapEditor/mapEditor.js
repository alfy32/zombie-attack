var map = new Map();
var saveTime = new Date();
setSaveTime();
var saveInterval = 15000;

if (mapId !== undefined) {
	map.setMap({width:0, height:0});
	
    $.get('/map/' + mapId, {}, function(data) {
		map.setMap(data);
        setTitle(data.title);
    });
}

function refresh() {
	clearInterval(interval);
	refreshMapEditor()
}

function setSaveTime(time) {
	saveTime = new Date();
	$("#save-time").html("Last Saved: " + formatTime(saveTime));
}

function formatTime(date) {
	var h = +date.getHours();
	var m = +date.getMinutes();
	var s = +date.getSeconds();

	if(h > 12) {
		h = h - 12;
	}

	if(h < 10) {
		h = "0" + h;
	}

	if(m < 10) {
		m = "0" + m;
	}

	if(s < 10) {
		s = "0" + s;
	}

	return h + ":" + m + ":" + s;
}

var interval = setInterval(function(){
	$("#save-time").html("Saving...");
	save();
}, saveInterval);

var choosers = new Choosers();

map.showGrid(true);
$('#showGridCHK').prop('checked', true);
bindShowGrid();
bindMapName();
bindKeyDown();

var tileImage = new Image();
tileImage.src = '/images/bottom.png';//'https://raw.github.com/CS-3450-Software-Engineering/class_documents/master/other_documents/bottom.png';
tileImage.onload = function() {
	map.setTileImage(tileImage);
	choosers.makeChoosers(map.getSpriteTileSize());
	choosers.bindChooserEvents();

	choosers.setLeftClickImage(22);
	map.setLeftClick(22);
	choosers.setRightClickImage(9);
	map.setRightClick(9);
};

function setTitle(title) {
    $("#map-title").val(title);
}

function backToMain() {
	loadMainPage();
}

function save() {
	$.post('/map', {map: map.getMap()}, function(data) {
		if(data.result === "success") {
			setSaveTime();
		} else {
			alert("Save failed: " + data);
		}
	});
}

function saveCopy() {
	var m = map.getMap();
	m.title += " - Copy";
	delete m._id;
	delete m._rev;
	
	$.post('/map', {map: m}, function(data) {
		if(data.result === "success") {
			setSaveTime();
			m._id = data.mapData.id;
			map.setMap(m);
			setTitle(m.title);
		} else {
			alert("Save failed: " + data);
		}
	});
}

function bindShowGrid() {
	$('#showGridCHK').change(function() {
		map.showGrid($('#showGridCHK').prop('checked'));
	});
}

function bindMapName() {
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