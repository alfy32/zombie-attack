
function getImages() {
	var bottom = new Image();
	var middle = new Image();
	var upper = new Image();


	bottom.src = '/images/bottom.png';
	middle.src = '/images/middle.png';
	upper.src = '/images/upper.png';

	bottom.onload = initBottomTiles;
	middle.onload = initMiddleTiles;
	upper.onload = initUpperTiles;
}

function initBottomTiles () {
	$('#bottom').html('');
}

function initMiddleTiles () {
	$('#middle').html('');
}

function initUpperTiles () {
	$('#upper').html('');
}

function makeCanvas(image, imageIndex) {
	var tileSize = 40;

	var canvas = $('<canvas>');
	$(canvas).attr('id', imageIndex);
	$(canvas).attr('class', "chooser");
	$(canvas).attr('width', tileSize);
	$(canvas).attr('height', tileSize);

	drawImage(image, canvas, imageIndex);
}

function drawImage(image, canvas, imageIndex) {
	var context = canvas[0].getContext('2d');

	var cols = 8;

	var tile = {
		top: Math.floor(imageIndex / cols) * tileSize,
		left: imageIndex % cols * tileSize,
		size: 40
	};

	var canvas = {
		top: 0,
		left: 0,
		size: 40
	};

	ctx.drawImage(tileImage,
				  tileLoc.x, tileLoc.y, tile.size, tile.size,
				  canvas.top, canvas.left, canvas.size, canvas.size);
}