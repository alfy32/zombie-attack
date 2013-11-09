
function Map() {
	var _canvas = document.getElementById('map');
	var _context = _canvas.getContext('2d');
	var _canvasTileSize = 40;
	var _offset = {
		x: 0,
		y: 0
	};

  var _show = {
    grid: true,
    bottom: true,
    middle: true,
    upper: true
  };

	var _zoomAmount = 5;

	var _backgroundColor = "grey";
	var _gridColor = "black";

  var _mouse = {
    button: undefined,
    clicked: false,
    over: false,
    x: 0,
    y: 0
  };

  var _select = {
    size: 1,
    color: 'blue'
  };

	var _spriteTileSize = 40;
	var _selectedTile = {
		bottom: { left: 22, right: 9 },
		middle: { left: 22, right: 9 },
		upper:  { left: 22, right: 9 }
	};
	var _images = {
		bottom: new Image(),
	 	middle: new Image(),
	 	upper: new Image()
	};
	var _initImageNumber = 22;
	var _currentLayer = 'bottom';

	var _mapHistory = [];
	var _historyIndex = -1;

	var _hasChanged = false;
	
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
    initMapLayer('bottom');
    initMapLayer('middle');
		initMapLayer('upper');
	}

	function initMapLayer(layer) {
		_map.data[layer] = [[]];
		for (var row = 0; row < _map.height; row++) {
			_map.data[layer][row] = [];
			for (var col = 0; col < _map.width; col++) {
				_map.data[layer][row][col] = _initImageNumber;
			}
		}
	}

	var _copyArea;

	this.copy = function() {
		var curr = currentBox();

		_copyArea = [];
		for(var row = 0; row < curr.height; row++) {
			_copyArea[row] = [];
			for(var col = 0; col < curr.width; col++) {
				_copyArea[row][col] = _map.data.bottom[curr.y+row][curr.x+col];
			}
		}
	};

	this.paste = function () {
		var curr = currentBox();

		if(curr.width && curr.height) {

			for(var row = 0; row < _copyArea.length; row++) {
				for(var col = 0; col < _copyArea[row].length; col++) {
					_map.data.bottom[curr.y+row][curr.x+col] = _copyArea[row][col];
				}
			}

			pushHistory();

			drawMap();
		}
	};

	this.getChanged = function() {
		return _hasChanged;
	};

	this.setChanged = function(changed) {
		_hasChanged = changed;
	}
	
	this.getHistory = function() {
		return _mapHistory;
	};
	
	this.getHistoryIndex = function() {
		return _historyIndex;
	};
	
	function pushHistory() {
		_mapHistory.splice(_historyIndex+1,_mapHistory.length);
		
		_mapHistory[++_historyIndex] = JSON.stringify(_map);
	}
	
	this.undo = function() {
		_historyIndex--;
		if(_historyIndex < 0) 
			_historyIndex = 0;
		
		_map = JSON.parse(_mapHistory[_historyIndex]);
		
		drawMap();
	};
	
	this.redo = function() {
		_historyIndex++;
		if(_historyIndex >= _mapHistory.length) {
			_historyIndex = _mapHistory.length-1;
		}
		
		_map = JSON.parse(_mapHistory[_historyIndex]);
		
		drawMap();
	};

	this.setSelected = function (selectedTile) {
		_selectedTile = selectedTile;
	};

	this.setMap = function(map) {
        _map = JSON.parse(JSON.stringify(map));
		
//		_map.title = _map.title | "";
//		_map.author = _map.author | "";
		_map.width = +_map.width | 0;
		_map.height = +_map.height | 0;
		_map.x = +_map.x | 0;
		_map.y = +_map.y | 0;
		
		if(!_map.data) {
			_map.data = {
				bottom: [[]],
				middle: [[]],
				top: [[]]
			};
		}

    validateLayer('bottom');
    validateLayer('middle');
    validateLayer('upper');
		
		if(_map.width && _map.height)
			pushHistory();
		
		drawMap();
	};

  function validateLayer(layer) {
    if(!_map.data[layer]) {
      _map.data[layer] = [];
    }

    for(var row = 0; row < _map.height; row++) {
      
      if(!_map.data[layer][row])
        _map.data[layer][row] = [];
      
      for(var col = 0; col < _map.width; col++) {
        if(_map.data[layer][row][col])
          _map.data[layer][row][col] = +_map.data[layer][row][col];
        else
          _map.data[layer][row][col] = -1;
      }
    }
  }

	this.getMap = function() {
		return JSON.parse(JSON.stringify(_map));
	};

	this.setTitle = function(title) {
		_map.title = title;
		_hasChanged = true;
	};

	this.getTitle = function() {
		return _map.title;
	};

	this.setCanvaTileSize = function(size) {
		_canvasTileSize = size;
		drawMap();
	};
	
	this.fillLeft = function() {
		fill(_map.data[_currentLayer], _selectedTile[_currentLayer]['left']);
		drawMap();
	};
	
	this.fillRight = function() {
		fill(_map.data[_currentLayer], _selectedTile[_currentLayer]['right']);
		drawMap();
	};
	
	function fill(layer, tileNumber) {
		for(var row = 0; row < _map.height; row++) {
			for(var col = 0; col < _map.width; col++){
				layer[row][col] = tileNumber;
			}
		}
	}

	this.setCurrentLayer = function(layer) {
		_currentLayer = layer;
	};
	
	this.increaseMapWidth = function() {
		_map.width += 1;
		
		for(var row = 0; row < _map.height; row++) {
			_map.data.bottom[row].push(_map.data.bottom[row][_map.width-2]);
		}
		
		pushHistory();

		drawMap();
	};
	
	this.decreaseMapWidth = function() {
		_map.width -= 1;
		
		for(var row = 0; row < _map.height; row++) {
			_map.data.bottom[row].pop();
		}	
		
		pushHistory();

		drawMap();	
	};
	
	this.increaseMapHeight = function() {
		_map.height += 1;
		
		var row = [];
		for(var col = 0; col < _map.width; col++) {
			row.push(_map.data.bottom[_map.height-2][col]);
		}
		_map.data.bottom.push(row);
		
		pushHistory();

		drawMap();
	};
	
	this.decreaseMapHeight = function() {
		_map.height -= 1;
		
		_map.data.bottom.pop();	
		
		pushHistory();

		drawMap();
	};
	
	this.increaseSelectSize = function() {
		_select.size += 1;
		
		var maxDim = _map.width > _map.height ? _map.width : _map.height;
		
		if(_select.size > maxDim) {
			_select.size = maxDim;
		}
	};
	
	this.decreaseSelectSize = function() {
		_select.size -= 1;
		
		if(_select.size < 1) {
			_select.size = 1;
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
		var showGrid = _show.grid;

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
		_show.grid = false;

		$(_canvas).hide();
		$('body').prepend(_canvas);

		drawMap();
		var data = _canvas.toDataURL();

		$(_canvas).remove();

		_canvas = canvas;
		_context = context;
		_canvasTileSize = canvasTileSize;
		_show.grid = showGrid;

		return data;
	};

	this.getSpriteTileSize = function() {
		return _spriteTileSize;
	};
	this.getCanvasTileSize = function() {
		return _canvasTileSize;
	};

	this.setImages = function(images) {
		_images = images;
		drawMap();
	};

	this.showGrid = function(show) {
		if (show !== undefined) {
			_show.grid = show;
			drawMap();
		} else {
			return _show.grid;
		}
	};

  this.showLayer = function(layer, show) {
    if(show !== undefined) {
      if(layer === 'bottom' || layer === 'middle' || layer === 'upper') {
        _show[layer] = show;
      }
    } else {
      if(layer === 'bottom' || layer === 'middle' || layer === 'upper') {
        _show[layer] = true;
      }
    }

    drawMap();
  }

	this.hideLayer = function(layer) {
    if(layer === 'bottom' || layer === 'middle' || layer === 'upper') {
      _show[layer] = false;
    }

    drawMap();
  }

  this.toggleLayer = function(layer) {
    if(layer === 'bottom' || layer === 'middle' || layer === 'upper') {
      _show[layer] = !_show[layer];
    }

    drawMap();
  }

	function changed(tileNumber, curr) {
		
		if(curr) {
			for(var row = curr.y; row < curr.y+curr.height; row++) {
				for(var col = curr.x; col < curr.x+curr.width; col++){
					if(_map.data.bottom[row][col] != tileNumber) {
						_hasChanged = true;
						return true;
					}
				}
			}			
		}
		
		return false;
	}

	function setCurrentTiles(tileNumber) {
		var curr = currentBox();
		
		if(changed(tileNumber, curr)) {
			
			for(var row = curr.y; row < curr.y+curr.height; row++) {
				for(var col = curr.x; col < curr.x+curr.width; col++){
					_map.data[_currentLayer][row][col] = tileNumber;
				}
			}
			
			if(_mouse.clicked)
				pushHistory();
		}
	}

	function drawTileImage(imageIndex, row, col, layer) {
		if (imageIndex === -1) {
			_context.fillStyle = "rgba(255, 255, 255, 0.0)";
			_context.fillRect(col * _canvasTileSize, row * _canvasTileSize,
					_canvasTileSize, _canvasTileSize);
		} else {
			var tileTop = Math.floor(imageIndex / 8) * _spriteTileSize;
			var tileLeft = imageIndex % 8 * _spriteTileSize;
			_context.drawImage(_images[layer],
					tileLeft, tileTop,
					_spriteTileSize, _spriteTileSize,
					(_offset.x * _canvasTileSize) + col * _canvasTileSize, (_offset.y * _canvasTileSize) + row * _canvasTileSize,
					_canvasTileSize, _canvasTileSize);
		}
	}

	function drawMap() {
		_context.clearRect(0, 0, _canvas.width, _canvas.height);

		drawBackground();

    if(_show.bottom) {
      drawLayer('bottom');
    }
    if(_show.middle) {
      drawLayer('middle');
		}
    if(_show.upper) {
      drawLayer('upper');
    }
		if (_show.grid) {
			drawGrid();
		}
		drawMouseSquare();
	}

	function drawLayer(layer) {
		for (var row = 0; row < _map.height; row++) {
			for (var col = 0; col < _map.width; col++) {
				if (_map.data[layer][row][col] !== undefined)
					drawTileImage(_map.data[layer][row][col], row, col, layer);
			}
		}
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
		if (_mouse.over && inMapArea()) {
			_context.strokeStyle = _select.color;
			
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
		var x = Math.floor(_mouse.x / _canvasTileSize) - _offset.x;
		var y = Math.floor(_mouse.y / _canvasTileSize) - _offset.y;
		var width = _select.size;
		var height = _select.size;

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

		_mouse.x = event.pageX - Math.round(position.left);
		_mouse.y = event.pageY - Math.round(position.top);

		if (_mouse.x > _canvas.width)
			_mouse.x = _canvas.width;
		if (_mouse.y > _canvas.height)
			_mouse.y = _canvas.height;
	}

	function inMapArea() {
		return currentBox() ? true : false;
	}

  function updateMouseButton(e) {
    _mouse.button =  e.which === 1 ? "left" : e.which === 3 ? 'right' : undefined;
  }

	function bindMouseDown() {
		$(_canvas).mousedown(function(event) {

			_mouse.clicked = true;
			_mouse.over = true;

      updateMousePositionRelativeToCanvas(event);
      updateMouseButton(event);

      console.log(_selectedTile.middle);

			if (inMapArea()) {
				setCurrentTiles(_selectedTile[_currentLayer][_mouse.button]);
			}

      drawMap();
		});
	}

	function bindMouseMove() {
		$(_canvas).mousemove(function(event) {
			
			_mouse.over = true;

			updateMousePositionRelativeToCanvas(event);
      updateMouseButton(event);

			if (_mouse.clicked && inMapArea()) {
				setCurrentTiles(_selectedTile[_currentLayer][_mouse.button]);
			}

      drawMap();
		});
	}
	
	function bindMouseOver() {
		$(_canvas).mouseover(function(event) {

			_mouse.over = true;

			updateMousePositionRelativeToCanvas(event);
      updateMouseButton(event);

			drawMap()
		});
	}

	function bindMouseUp() {
		$(_canvas).mouseup(function(event) {

			_mouse.clicked = false;
			_mouse.over = true;

			updateMousePositionRelativeToCanvas(event);
      updateMouseButton(event);

			if (inMapArea()) {
				setCurrentTiles(_selectedTile[_currentLayer][_mouse.button]);
			}

			drawMap();
		});
	}

	function bindMouseOut() {
		$(_canvas).mouseout(function(event) {
			_mouse.over = false;

			drawMap();
		});
	}
}