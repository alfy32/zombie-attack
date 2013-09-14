
function Map() {
	var _canvas = document.getElementById('map');
	var _context = _canvas.getContext('2d');
	var _mapWidth = _context.canvas.width;
	var _mapHeight = _context.canvas.height;

	var _mouseButtonClicked = false;
	var _mouseover = false;
	var _mouseX = 0;
	var _mouseY = 0;

	var _tileSize = 40;
	var _numRows = Math.floor(_mapHeight / _tileSize);
	var _numCols = Math.floor(_mapWidth / _tileSize);
	var _leftClickTile = -1;
	var _rightClickTile = -1;
	var _tileImage = new Image();
	var _tiles;

	init();

	function init() {
		_context.font = "bold 30px sans-serif";
		_context.fillText("Loading......", _mapWidth / 2 - 100, _mapHeight / 2);

		bindContextMenu();
		bindMouseDown();
		bindMouseOver();
		bindMouseUp();
		bindMouseOut();
		initTiles();
	}

	function initTiles() {
		_tiles = [];
		for (var row = 0; row < _numRows; row++) {
			_tiles[row] = [];
			for (var col = 0; col < _numCols; col++) {
				_tiles[row][col] = -1;
			}
		}
	}

	this.setTileImage = function(image) {
		_tileImage = image;
		drawMap();
	};

	this.getTile = function(row, col) {
		return _tiles[row][col];
	};

	this.setTile = function(row, col, tileNumber) {
		_tiles[row][col] = tileNumber;
	};

	function setCurrentTile(tileNumber) {
		_tiles[currentBoxY()][currentBoxX()] = tileNumber;
	}

	this.getTileSize = function() {
		return _tileSize;
	};

	this.setLeftClick = function(tileIndex) {
		_leftClickTile = tileIndex;
	};
	this.setRightClick = function(tileIndex) {
		_rightClickTile = tileIndex;
	};

	function drawTileImage(imageIndex, row, col) {
		if (imageIndex === -1) {
			_context.fillStyle = 'white';
			_context.fillRect(col * _tileSize, row * _tileSize,
					_tileSize, _tileSize);
		} else {
			var tileTop = Math.floor(imageIndex / 8) * _tileSize;
			var tileLeft = imageIndex % 8 * _tileSize;
			_context.drawImage(_tileImage,
					tileLeft, tileTop,
					_tileSize, _tileSize,
					col * _tileSize, row * _tileSize,
					_tileSize, _tileSize);
		}
	}

	function drawMap() {
		$(_tiles).each(function(row, rowArray) {
			$(rowArray).each(function(col, cellValue) {
				drawTileImage(cellValue, row, col);
			});
		});
		drawMouseSquare();
	}

	function drawMouseSquare() {
		if (_mouseover) {
			_context.fillStyle = 'black';
			_context.strokeRect(currentBoxX() * _tileSize, currentBoxY() * _tileSize,
					_tileSize, _tileSize);
		}
	}

	this.printTiles = function() {
		$(_tiles).each(function(index, row) {
			var rowStr = 'Row ' + index + ':	';
			$(row).each(function(index, col) {
				rowStr += col + ' ';
			});
			console.log(rowStr);
		});
	};

	this.drawRectangle = function(x, y, color) {
		_context.fillStyle = color;
		_context.fillRect(x, y, _tileSize, _tileSize);
	};

	function currentBox() {
		return [Math.floor(_mouseX / _tileSize), Math.floor(_mouseY / _tileSize)];
	}

	function currentBoxX() {
		return Math.floor(_mouseX / _tileSize);
	}
	function currentBoxY() {
		return Math.floor(_mouseY / _tileSize);
	}

	function bindContextMenu() {
		$(_canvas).bind("contextmenu", function(e) {
			e.preventDefault();
		});
	}

	function bindMouseDown() {
		$(_canvas).mousedown(function(event) {
			_mouseButtonClicked = true;
			_mouseover = true;

			_mouseX = event.offsetX;
			_mouseY = event.offsetY;

			setCurrentTile(event.which === 1 ? _leftClickTile : _rightClickTile);


			writeMouseInfo(event);
		});
	}

	function bindMouseOver() {
		$(_canvas).mousemove(function(event) {
			_mouseX = event.offsetX;
			_mouseY = event.offsetY;
			_mouseover = true;

			if (_mouseButtonClicked) {
				setCurrentTile(event.which === 1 ? _leftClickTile : _rightClickTile);
			}
			writeMouseInfo(event);
		});
	}

	function bindMouseUp() {
		$(_canvas).mouseup(function(event) {
			_mouseButtonClicked = false;
			_mouseover = true;
			_mouseX = event.offsetX;
			_mouseY = event.offsetY;

			setCurrentTile(event.which === 1 ? _leftClickTile : _rightClickTile);

			writeMouseInfo(event);
		});
	}

	function bindMouseOut() {
		$(_canvas).mouseout(function(event) {
			_mouseover = false;

			writeMouseInfo(event);
		});
	}

	function writeMouseInfo(event) {
		$('#position').html($('<p/>').append(
				"Button: " + (event.which === 1 ? "Left" : "Right") + "<br/>" +
				"X: " + _mouseX + " Y: " + _mouseY + "<br/>" +
				"Clicked: " + _mouseButtonClicked
				));

		drawMap();
	}
}