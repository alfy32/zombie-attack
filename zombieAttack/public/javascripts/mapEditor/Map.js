
function Map() {
	var _canvas = document.getElementById('map');
	var _context = _canvas.getContext('2d');
	var _canvasWidth = _context.canvas.width;
	var _canvasHeight = _context.canvas.height;

	var _mouseButtonClicked = false;
	var _mouseover = false;
	var _mouseX = 0;
	var _mouseY = 0;

	var _tileSize = 40;
	var _leftClickTile = -1;
	var _rightClickTile = -1;
	var _tileImage = new Image();

	var _map = {
		title: 'NO_TITLE',
		author: 'NO_AUTHOR',
		width: Math.floor(_canvasHeight / _tileSize),
		height: Math.floor(_canvasWidth / _tileSize),
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
		_context.fillText("Loading......", _canvasWidth / 2 - 100, _canvasHeight / 2);

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
				_map.data.bottom[y][x] = -1;
			}
		}
	}

	this.setMap = function(map) {
		_map = map;
	};

	this.getMap = function() {
		return _map;
	};

	this.logJSON = function() {
		console.log(_map);
	};
	
	this.getImage = function() {
		return _canvas.toDataURL();
	};
	
	this.getTileSize = function(){
		return _tileSize;
	};

	this.setTileImage = function(image) {
		_tileImage = image;
		drawMap();
	};

	function setCurrentBottomTile(tileNumber) {
		_map.data.bottom[currentBoxY()][currentBoxX()] = tileNumber;
	}

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
		$(_map.data.bottom).each(function(row, rowArray) {
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
		$(_map.data.bottom).each(function(index, row) {
			var rowStr = 'Row ' + index + ':	';
			$(row).each(function(index, col) {
				rowStr += col + ' ';
			});
			console.log(rowStr);
		});
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

	function updateMousePositionRelativeToCanvas(event) {
		var position = $(event.target).offset();

		_mouseX = event.pageX - Math.round(position.left);
		_mouseY = event.pageY - Math.round(position.top);
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