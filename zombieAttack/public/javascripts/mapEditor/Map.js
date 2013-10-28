
function Map() {
	var _canvas = document.getElementById('map');
	var _context = _canvas.getContext('2d');
	var _canvasTileSize = 40;
	var _offset = {
		x: 0,
		y: 0
	};
	var _showGrid = true;

	var _zoomAmount = 5;

	var _backgroundColor = "grey";
	var _gridColor = "black";

	var _showMouseLoc = false;

	var _mouseButtonClicked = false;
	var _mouseover = false;
	var _mouseX = 0;
	var _mouseY = 0;
	var _selectSize = 1;
	var _selectColor = "blue";

	var _spriteTileSize = 40;
	var _leftClickTile = -1;
	var _rightClickTile = -1;
	var _tileImage = new Image();
	var _initImageNumber = 22;

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

		bindContextMenu();
		bindMouseDown();
		bindMouseOver();
		bindMouseMove();
		bindMouseUp();
		bindMouseOut();
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
	
	this.fillLeft = function() {
		fill(_map.data.bottom, _leftClickTile);
		drawMap();
	};
	
	this.fillRight = function() {
		fill(_map.data.bottom, _rightClickTile);
		drawMap();
	};
	
	function fill(layer, tileNumber) {
		for(var row = 0; row < _map.height; row++) {
			for(var col = 0; col < _map.width; col++){
				layer[row][col] = tileNumber;
			}
		}
	}
	
	this.increaseMapWidth = function() {
		_map.width += 1;
		
		for(var row = 0; row < _map.height; row++) {
			_map.data.bottom[row].push(_map.data.bottom[row][_map.width-2]);
		}
		
		drawMap();
	};
	
	this.decreaseMapWidth = function() {
		_map.width -= 1;
		
		for(var row = 0; row < _map.height; row++) {
			_map.data.bottom[row].pop();
		}	
		
		drawMap();	
	};
	
	this.increaseMapHeight = function() {
		_map.height += 1;
		
		var row = [];
		for(var col = 0; col < _map.width; col++) {
			row.push(_map.data.bottom[_map.height-2][col]);
		}
		_map.data.bottom.push(row);
		
		drawMap();
	};
	
	this.decreaseMapHeight = function() {
		_map.height -= 1;
		
		_map.data.bottom.pop();	
		
		drawMap();
	};
	
	this.increaseSelectSize = function() {
		_selectSize += 1;
		
		var maxDim = _map.width > _map.height ? _map.width : _map.height;
		
		if(_selectSize > maxDim) {
			_selectSize = maxDim;
		}
	};
	
	this.decreaseSelectSize = function() {
		_selectSize -= 1;
		
		if(_selectSize < 1) {
			_selectSize = 1;
		}
	};

	this.zoomIn = function() {
//		var currBox = currentBox();
//		
		_canvasTileSize += _zoomAmount;
		
//		if(inMapArea()) {
//			var newBox = currentBox();
//			_offset.x += newBox.x - currBox.x ;
//			_offset.y += newBox.y - currBox.y;
//			
//			console.log({
//				curr: currBox,
//				new: newBox
//			});
//		}
//		
		drawMap();
	};

	this.zoomOut = function() {
//		var currBox = currentBox();
//		
		_canvasTileSize -= _zoomAmount;
		
		if(_canvasTileSize <= 0)
			_canvasTileSize = _zoomAmount;
		
//		if(inMapArea()) {
//			var newBox = currentBox();
//			_offset.x += newBox.x - currBox.x;
//			_offset.y += newBox.y - currBox.y;
//		}
//		
		drawMap();
	};

	this.moveRight = function() {
		_offset.x += 1;
		drawMap();
	};

	this.moveLeft = function() {
		_offset.x -= 1;
		drawMap();
	};

	this.moveUp = function() {
		_offset.y -= 1;
		drawMap();
	};

	this.moveDown = function() {
		_offset.y += 1;
		drawMap();
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

		if (_showGrid) {
			drawGrid();
		}
		drawMouseSquare();
	}

	function drawBackground() {
		_context.fillStyle = _backgroundColor;
		_context.fillRect(0, 0, _canvas.width, _canvas.height);
	}

	function drawGrid() {
		_context.strokeStyle = _gridColor;
		_context.beginPath();

		var width = _map.width * _canvasTileSize;
		var height = _map.height * _canvasTileSize;
		
		var top = _offset.y * _canvasTileSize;
		var bottom = top + height;
		
		var left = _offset.x * _canvasTileSize;
		var right = left + width;

		for (var i = left; i <= right; i += _canvasTileSize) {
			_context.moveTo(i, top);
			_context.lineTo(i, bottom);
		}

		for (var i = top; i <= bottom; i += _canvasTileSize) {
			_context.moveTo(left, i);
			_context.lineTo(right, i);
		}

		_context.stroke();
	}

	function drawMouseSquare() {
		if (_mouseover && inMapArea()) {
			_context.strokeStyle = _selectColor;
			
			var currBox = currentBox();
			
			if(currBox) {
				var top = (_offset.x + currBox.x) * _canvasTileSize;
				var left = (_offset.y + currBox.y) * _canvasTileSize;
				var width = currBox.width * _canvasTileSize;
				var height = currBox.height * _canvasTileSize;
			
				_context.strokeRect(top, left, width, height);
			}
		}
	}
	
	function currentBox() {
		var x = Math.floor(_mouseX / _canvasTileSize) - _offset.x;
		var y = Math.floor(_mouseY / _canvasTileSize) - _offset.y;
		var width = _selectSize;
		var height = _selectSize;

		if (x < 0 || x >= _map.width || y < 0 || y >= _map.height) 
			return undefined;
				
		// center the box.
		x -= Math.floor((width)/2) + width % 2 - 1;
		y -= Math.floor((height)/2) + height % 2 - 1;
		
		// shrink right side if off map
		if( (x + width) > _map.width) 
			width = _map.width - x;
		
		// shrink bottom if off map.
		if( (y + height) > _map.height)
			height = _map.height - y;
		
		// shrink left if off map
		if(x < 0) {
			width += x;
			x = 0;
		}
		
		// shrink top if off map
		if(y < 0) {
			height += y;
			y = 0;
		}
		
		return {
			x: x,
			y: y,
			width: width,
			height: height
		};		
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

	function inMapArea() {
		return currentBox() ? true : false;
	}

	function bindMouseDown() {
		$(_canvas).mousedown(function(event) {

			_mouseButtonClicked = true;
			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			if (inMapArea()) {
				if (event.which === 1) {
					setCurrentBottomTiles(_leftClickTile);
				}
				if (event.which === 3) {
					setCurrentBottomTiles(_rightClickTile);
				}
			}
			writeMouseInfo(event);
		});
	}

	function bindMouseMove() {
		$(_canvas).mousemove(function(event) {
			
			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			if (_mouseButtonClicked && inMapArea()) {
				if (event.which === 1) {
					setCurrentBottomTiles(_leftClickTile);
				}
				if (event.which === 3) {
					setCurrentBottomTiles(_rightClickTile);
				}
			}
			writeMouseInfo(event);
		});
	}
	
	function bindMouseOver() {
		$(_canvas).mouseover(function(event) {

			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			writeMouseInfo(event);
		});
	}

	function bindMouseUp() {
		$(_canvas).mouseup(function(event) {

			_mouseButtonClicked = false;
			_mouseover = true;

			updateMousePositionRelativeToCanvas(event);
			if (inMapArea()) {
				if (event.which === 1) {
					setCurrentBottomTiles(_leftClickTile);
				}
				if (event.which === 3) {
					setCurrentBottomTiles(_rightClickTile);
				}
			}
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
		if (_showMouseLoc) {
			$('#position').html($('<p/>').append(
					"Button: " + (event.which === 1 ? "Left" : "Right") + "<br/>" +
					"X: " + _mouseX + " Y: " + _mouseY + "<br/>" +
					"Clicked: " + _mouseButtonClicked
					));

		}
		drawMap();
	}
}