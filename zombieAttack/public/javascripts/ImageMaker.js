
function ImageMaker(canvasId) {
	var _canvas = document.getElementById(canvasId);
	var _context = _canvas.getContext('2d');
	var _canvasTileSize = 40;

	var _backgroundColor = "grey";

	var _spriteTileSize = 40;
	var _tileImage = new Image();
	
	var _initImageNumber = -1;

	var _map = {
		title: 'NO_TITLE',
		author: 'NO_AUTHOR',
		width: 15,
		height: 12,
		x: 0,
		y: 0,
		events: [],
		data: {
			bottom: [[]],
			middle: [[]],
			top: [[]]
		},
		env: "NO_ENV"
	};

	init();

	function init() {
		_context.font = "bold 30px sans-serif";
		_context.fillText("Loading......", _canvas.width / 2 - 100, _canvas.height / 2);
		
		initMapBottom();
	}

	function initMapBottom() {
		_map.data.bottom = [[]];
		for (var row = 0; row < _map.height; row++) {
			_map.data.bottom[row] = [];
			for (var col = 0; col < _map.width; col++) {
				_map.data.bottom[row][col] = _initImageNumber;
			}
		}
	}

	this.setMap = function(map) {
        _map = JSON.parse(JSON.stringify(map));
		
		_map.title = _map.title | "";
		_map.author = _map.author | "";
		_map.width = +_map.width | 0;
		_map.height = +_map.height | 0;
		_map.x = +_map.x | 0;
		_map.y = _map.y | 0;
		
		_map.data = _map.data | { bottom: [[]], middle: [[]], top: [[]] };
		
		_map.data.bottom = _map.data.bottom | [];
		for(var row = 0; row < _map.height; row++) {
			_map.data.bottom[row] = _map.data.bottom[row] | [];
			for(var col = 0; col < _map.width; col++) {
				_map.data.bottom[row][col] = +_map.data.bottom[row][col];
			}
		}
		
		drawMap();
	};

	this.getMap = function() {
		return JSON.parse(JSON.stringify(_map));
	};

	this.setTitle = function(title) {
		_map.title = title;
	};

	this.getTitle = function() {
		return _map.title;
	};

	this.setCanvaTileSize = function(size) {
		_canvasTileSize = size;
		drawMap();
	};
	
	this.getImage = function(args) {
		var canvas = _canvas;
		var context = _context;
		var canvasTileSize = _canvasTileSize;
		
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
		
		$(_canvas).hide();
		$('body').prepend(_canvas);

		drawMap();
		var data = _canvas.toDataURL();

		$(_canvas).remove();

		_canvas = canvas;
		_context = context;
		_canvasTileSize = canvasTileSize;
		
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
	};

	function setCurrentBottomTiles(tileNumber) {
		var curr = currentBox();
		
		if(curr) {
			for(var row = curr.y; row < curr.y+curr.height; row++) {
				for(var col = curr.x; col < curr.x+curr.width; col++){
					_map.data.bottom[row][col] = tileNumber;
				}
			}			
		}
	}

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
					(_offset.x * _canvasTileSize) + col * _canvasTileSize, (_offset.y * _canvasTileSize) + row * _canvasTileSize,
					_canvasTileSize, _canvasTileSize);
		}
	}

	function drawMap() {
		_context.clearRect(0, 0, _canvas.width, _canvas.height);

		drawBackground();

		for (var row = 0; row < _map.height; row++) {
			for (var col = 0; col < _map.width; col++) {
				if (_map.data.bottom[row][col])
					drawTileImage(_map.data.bottom[row][col], row, col);
			}
		}

		drawMouseSquare();
	}

	function drawBackground() {
		_context.fillStyle = _backgroundColor;
		_context.fillRect(0, 0, _canvas.width, _canvas.height);
	}
}