
function Map() {
	var _canvas = document.getElementById('map');
	var _context = _canvas.getContext('2d');
	var _canvasTileSize = 40;
	var _showGrid = true;

	var _mouseButtonClicked = false;
	var _mouseover = false;
	var _mouseX = 0;
	var _mouseY = 0;

	var _spriteTileSize = 40;
	var _leftClickTile = -1;
	var _rightClickTile = -1;
	var _tileImage = new Image();
	var _initImageNumber = -1;

	var _map = {
		title: 'NO_TITLE',
		author: 'NO_AUTHOR',
		width: Math.floor(_canvas.height / _canvasTileSize),
		height: Math.floor(_canvas.width / _canvasTileSize),
		x: 0,
		y: 0,
		events: [],
		data: {
			bottom: [],
			middle: [],
			top: []
		},
		env: "NO_ENV"
	};

	init();

	function init() {
		_context.font = "bold 30px sans-serif";
		_context.fillText("Loading......", _canvas.width / 2 - 100, _canvas.height / 2);

		bindContextMenu();
		bindMouseDown();
		bindMouseOver();
		bindMouseUp();
		bindMouseOut();
		initMapBottom();
	}

	function initMapBottom() {
		_map.data.bottom = [];
		for (var y = 0; y < _map.height; y++) {
			_map.data.bottom[y] = [];
			for (var x = 0; x < _map.width; x++) {
				_map.data.bottom[y][x] = _initImageNumber;
			}
		}
	}

	this.setMap = function(map) {
		_map = JSON.parse(JSON.stringify(map));
		drawMap();
	};

	this.getMap = function() {
		return JSON.parse(JSON.stringify(_map));
	};

	this.logJSON = function() {
		console.log(_map);
	};

	this.getImage = function(args) {
		var canvas = _canvas;
		var context = _context;
		var canvasTileSize = _canvasTileSize;
		var showGrid = _showGrid;

		var ratio = 200;

		if (args.width) {
			ratio = _canvas.width / args.width;
		} else if (args.height) {
			ratio = _canvas.height / args.height;
		}

		_canvas = document.createElement('canvas');
		_context = _canvas.getContext('2d');
		_canvas.width = canvas.width / ratio;
		_canvas.height = canvas.height / ratio;
		_canvasTileSize = canvasTileSize / ratio;
		_showGrid = false;

		$(_canvas).hide();
		$('body').prepend(_canvas);

		drawMap();
		var data = _canvas.toDataURL();

		$(_canvas).remove();

		_canvas = canvas;
		_context = context;
		_canvasTileSize = canvasTileSize;
		_showGrid = showGrid;

		return data;
	};

	this.getSpriteTileSize = function() {
		return _spriteTileSize;
	};
	this.getCanvasTileSize = function() {
		return _canvasTileSize;
	};

	this.setTileImage = function(image) {
		_tileImage = image;
		drawMap();
	};

	this.showGrid = function(show) {
		if (show !== undefined) {
			_showGrid = show;
			drawMap();
		} else {
			return _showGrid;
		}
	};

	function setCurrentBottomTile(tileNumber) {
		var x = currentBoxX();
		var y = currentBoxY();

		x = x > _map.width - 1 ? x - 1 : x < 0 ? 0 : x;
		y = y > _map.height - 1 ? y - 1 : y < 0 ? 0 : y;

		_map.data.bottom[y][x] = tileNumber;
	}

	this.setLeftClick = function(tileIndex) {
		_leftClickTile = tileIndex;
	};
	this.setRightClick = function(tileIndex) {
		_rightClickTile = tileIndex;
	};

	function drawTileImage(imageIndex, row, col) {
		if (imageIndex === -1) {
			_context.fillStyle = "rgba(255, 255, 255, 0.0)";
			_context.fillRect(col * _canvasTileSize, row * _canvasTileSize,
					_canvasTileSize, _canvasTileSize);
		} else {
			var tileTop = Math.floor(imageIndex / 8) * _spriteTileSize;
			var tileLeft = imageIndex % 8 * _spriteTileSize;
			_context.drawImage(_tileImage,
					tileLeft, tileTop,
					_spriteTileSize, _spriteTileSize,
					col * _canvasTileSize, row * _canvasTileSize,
					_canvasTileSize, _canvasTileSize);
		}
	}

	function drawMap() {
		_context.clearRect(0, 0, _canvas.width, _canvas.height);

		$(_map.data.bottom).each(function(row, rowArray) {
			$(rowArray).each(function(col, cellValue) {
				drawTileImage(cellValue, row, col);
			});
		});
		$(_map.data.middle).each(function(row, rowArray) {
			$(rowArray).each(function(col, cellValue) {
				drawTileImage(cellValue, row, col);
			});
		});
		$(_map.data.top).each(function(row, rowArray) {
			$(rowArray).each(function(col, cellValue) {
				drawTileImage(cellValue, row, col);
			});
		});
		if (_showGrid) {
			drawGrid();
		}
		drawMouseSquare();
	}

	function drawGrid() {
		_context.strokeStyle = 'grey';
		_context.beginPath();

		for (var i = 0; i <= _canvas.width; i += _canvasTileSize) {
			_context.moveTo(i, 0);
			_context.lineTo(i, _canvas.height);
		}

		for (var i = 0; i <= _canvas.height; i += _canvasTileSize) {
			_context.moveTo(0, i);
			_context.lineTo(_canvas.width, i);
		}

		_context.stroke();
	}

	function drawMouseSquare() {
		if (_mouseover) {
			_context.strokeStyle = 'blue';
			_context.strokeRect(currentBoxX() * _canvasTileSize, currentBoxY() * _canvasTileSize,
					_canvasTileSize, _canvasTileSize);
		}
	}

	this.printTiles = function() {
		$(_map.data.bottom).each(function(index, row) {
			var rowStr = 'Row ' + index + ':	';
			$(row).each(function(index, col) {
				rowStr += col + ' ';
			});
			console.log(rowStr);
		});
	};

	function currentBox() {
		return [Math.floor(_mouseX / _canvasTileSize), Math.floor(_mouseY / _canvasTileSize)];
	}

	function currentBoxX() {
		return Math.floor(_mouseX / _canvasTileSize);
	}
	function currentBoxY() {
		return Math.floor(_mouseY / _canvasTileSize);
	}

	function bindContextMenu() {
		$(_canvas).bind("contextmenu", function(e) {
			e.preventDefault();
		});
	}

	function updateMousePositionRelativeToCanvas(event) {
		var position = $(event.target).offset();

		_mouseX = event.pageX - Math.round(position.left);
		_mouseY = event.pageY - Math.round(position.top);

		if (_mouseX > _canvas.width)
			_mouseX = _canvas.width;
		if (_mouseY > _canvas.height)
			_mouseY = _canvas.height;
	}

	function bindMouseDown() {
		$(_canvas).mousedown(function(event) {

			_mouseButtonClicked = true;
			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			setCurrentBottomTile(event.which === 1 ? _leftClickTile : _rightClickTile);
			writeMouseInfo(event);
		});
	}

	function bindMouseOver() {
		$(_canvas).mousemove(function(event) {

			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			if (_mouseButtonClicked) {
				setCurrentBottomTile(event.which === 1 ? _leftClickTile : _rightClickTile);
			}
			writeMouseInfo(event);
		});
	}

	function bindMouseUp() {
		$(_canvas).mouseup(function(event) {

			_mouseButtonClicked = false;
			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			setCurrentBottomTile(event.which === 1 ? _leftClickTile : _rightClickTile);
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