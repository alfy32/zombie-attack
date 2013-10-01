
//function previewMap() {
//	var canv = document.getElementById('map');
//	imgsr = canv.toDataURL("image/jpeg");
//	document.write('<img src="' + imgsr + '"/>');
//}

var map = new Map();
var choosers = new Choosers();

var tileImage = new Image();
tileImage.src = 'https://raw.github.com/CS-3450-Software-Engineering/class_documents/master/other_documents/bottom.png';
tileImage.onload = function() {
	map.setTileImage(tileImage);
	choosers.makeChoosers(map.getTileSize());
	choosers.bindChooserEvents();
};
var preview = $('#mapPreview').attr('src', map.getImage());

function backToMain() {
	$('#load-stuff-here').load('main.html');
	fag = "main";
}

function save() {
	$.post('/map', {map: map.getMap(), mapImage: map.getImage()}, function(data) {
		console.log(data);
	});
}


