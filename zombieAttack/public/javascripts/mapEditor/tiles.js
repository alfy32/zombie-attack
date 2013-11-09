
function unselectTile(whichButton) {
  var id = selectedTile[currentLayer][whichButton];
  
  $('#' + currentLayer + " #" + id).removeClass(whichButton + '-click');
}

function selectTile(id, whichButton) {
  selectedTile[currentLayer][whichButton] = id;
  
  $('#' + currentLayer + " #" + id).addClass(whichButton + '-click');

  drawImage(image[currentLayer], id, $('#' + whichButton + '-click'));
  map.setCurrentLayer(currentLayer);
}

function bindClick(canvas) {
  $(canvas).mousedown(function(e){
    var id = +$(canvas).attr('id');
    var which = e.which === 1 ? 'left' : e.which === 3 ? 'right' : 'middle';

    unselectTile(which);
    selectTile(id, which);

    return true;
  });

  $(canvas).bind("contextmenu", function(e) {
    e.preventDefault();
  });
}

function setLayer(layer) {
  currentLayer = layer;

  selectTile(selectedTile[currentLayer]['left'], 'left');
  selectTile(selectedTile[currentLayer]['right'], 'right');

  map.showLayer(layer);
  $('#CHK-' + layer).prop('checked', true);
}

function initBottomTiles () {
	var bottomDiv = $('#bottom');
	$(bottomDiv).empty();

	var numTiles = 43;

	for(var i = 0; i < numTiles; i++) {
		var canvas = makeCanvas(i);
		
    $(bottomDiv).append(canvas);
    bindClick(canvas);

    if(i%8 == 7) {
      $(bottomDiv).append('<br/>');
    }
	 
    drawImage(this, i, canvas);

  }

  selectTile(selectedTile[currentLayer]['left'], 'left');
  selectTile(selectedTile[currentLayer]['right'], 'right');
}

function initMiddleTiles () {
	var middleDiv = $('#middle');
  $(middleDiv).empty();

  var numTiles = 72;

  for(var i = 0; i < numTiles; i++) {
    var canvas = makeCanvas(i);
    
    $(middleDiv).append(canvas);
    bindClick(canvas);

    if(i%8 == 7) {
      $(middleDiv).append('<br/>');
    }
   
    drawImage(this, i, canvas);

  }
}

function initUpperTiles () {
	var upperDiv = $('#upper');
  $(upperDiv).empty();

  var numTiles = 9;

  for(var i = 0; i < numTiles; i++) {
    var canvas = makeCanvas(i);
    
    $(upperDiv).append(canvas);
    bindClick(canvas);

    if(i%8 == 7) {
      $(upperDiv).append('<br/>');
    }
   
    drawImage(this, i, canvas);

  }
}

function makeCanvas(imageIndex) {
	var tileSize = 40;

	var canvas = $('<canvas>');
	$(canvas).attr('id', imageIndex);
	$(canvas).attr('class', "chooser");
	$(canvas).attr('width', tileSize);
	$(canvas).attr('height', tileSize);

	return canvas;
}

function drawImage(image, imageIndex, canvas) {
	var context = canvas[0].getContext('2d');
	var tileSize = 40;

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

  context.clearRect(0,0,tileSize,tileSize);

	context.drawImage(image,
		tile.left, tile.top, tile.size, tile.size,
		canvas.left, canvas.top, canvas.size, canvas.size);
}