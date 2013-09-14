
var map = new Map();
var choosers = new Choosers();

var tileImage = new Image();
tileImage.src = 'https://raw.github.com/CS-3450-Software-Engineering/class_documents/master/other_documents/bottom.png';
tileImage.onload = function() {
	map.setTileImage(tileImage);
	choosers.makeChoosers(map.getTileSize());
	choosers.bindChooserEvents();
};
