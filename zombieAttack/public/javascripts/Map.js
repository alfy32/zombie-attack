
function Map() {
    var _canvas = document.getElementById('map');
    var _context = _canvas.getContext('2d');
    var _tileSize = 40;

    var _leftClickTile = 0;
    var _rightClickTile = 1;

    var _mouseButtonClicked = false;
    var _mouseX = 0;
    var _mouseY = 0;

    var _tiles = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    disableRightClick();

    this.getTile = function(row, col) {
        return _tiles[row][col];
    };

    this.setTile = function(row, col, tileNumber) {
        _tiles[row][col] = tileNumber;
    };

    this.getTileSize = function() {
        return _tileSize;
    };

    this.drawRectangle = function(x, y, color) {
        _context.fillStyle = color;
        _context.fillRect(x, y, _tileSize, _tileSize);
    };

    function disableRightClick() {
        $(_canvas).bind("contextmenu", function(e) {
            e.preventDefault();
        });
    }

    function currentBox() {
        return [Math.floor(_mouseX / _tileSize), Math.floor(_mouseY / _tileSize)];
    }

    function currentBoxX() {
        return Math.floor(_mouseX / _tileSize);
    }
    function currentBoxY() {
        return Math.floor(_mouseY / _tileSize);
    }

    function bindMouseDown() {
        $(_canvas).mousedown(function(event) {
            _mouseButtonClicked = true;
            _mouseX = event.offsetX;
            _mouseY = event.offsetY;

            if (event.which === 1) {
                _tiles[currentBoxX(), currentBoxY()] = _leftClickTile;
            } else if (event.which === 3) {
                _tiles[currentBoxX(), currentBoxY()] = _rightClickTile;
            }

            writeMouseInfo(event);
        });
    }

    function writeMouseInfo(event) {
        $('#position').html("Button: " + event.which === 1 ? "Left " : "Right " + "X: " + x + " Y: " + y + "<br/>Clicked: " + _mouseButtonClicked);
    }
}

function Tile() {
    var _id = 0;
    var _tileImage;

    this.getId = function() {
        return _id;
    };

    this.setId = function(tileId) {
        _id = tileId;
    };

    this.getTileImage = function() {
        return _tileImage;
    };

    this.setTileImage = function(tileImage) {
        _tileImage = tileImage;
    };
}


