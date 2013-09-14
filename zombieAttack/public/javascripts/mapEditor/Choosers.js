
function Choosers() {
	var _numberOfTiles = 43;
	var _chooserCanvasClass = 'canvas';
	var _chooserDiv = $('#choosers');
	var _leftClickChooserId = 'leftClick';
	var _rightClickChooserId = 'rightClick';

	this.makeChoosers = function(tileSize) {
		$(_chooserDiv).html('');
		for (var i = 0; i < _numberOfTiles; i++) {

			var canvas = $('<canvas>');
			$(canvas).attr('id', i);
			$(canvas).attr('class', _chooserCanvasClass);
			$(canvas).attr('width', tileSize);
			$(canvas).attr('height', tileSize);

			$(_chooserDiv).append(canvas)
					.append(' ');

			this.drawChooser(i);
		}
	};

	this.drawChooser = function(imageIndex) {
		var ctx = document.getElementById(imageIndex).getContext('2d');

		var _tileSize = map.getTileSize();

		var tileTop = Math.floor(imageIndex / 8) * _tileSize;
		var tileLeft = imageIndex % 8 * _tileSize;

		ctx.drawImage(tileImage,
				tileLeft, tileTop,
				_tileSize, _tileSize,
				0, 0,
				_tileSize, _tileSize);
	};

	this.bindChooserEvents = function() {
		$('.' + _chooserCanvasClass).bind("contextmenu", function(event) {
			event.preventDefault();
		});

		$('.' + _chooserCanvasClass).mousedown(function(event) {
			event.preventDefault();

			var tileNumber = $(event.target).attr('id');

			if (event.which === 1) {
				map.setLeftClick(tileNumber);
				updateRightClickImage(tileNumber);
			} else if (event.which === 3) {
				map.setRightClick(tileNumber);
				updateLefttClickImage(tileNumber);
			}
		});
	};

	function updateRightClickImage(tileNumber) {
		var ctx = document.getElementById(_leftClickChooserId).getContext('2d');

		var _tileSize = map.getTileSize();

		var tileTop = Math.floor(tileNumber / 8) * _tileSize;
		var tileLeft = tileNumber % 8 * _tileSize;

		ctx.drawImage(tileImage,
				tileLeft, tileTop,
				_tileSize, _tileSize,
				0, 0,
				_tileSize, _tileSize);
	}

	function updateLefttClickImage(tileNumber) {
		var ctx = document.getElementById(_rightClickChooserId).getContext('2d');

		var _tileSize = map.getTileSize();

		var tileTop = Math.floor(tileNumber / 8) * _tileSize;
		var tileLeft = tileNumber % 8 * _tileSize;

		ctx.drawImage(tileImage,
				tileLeft, tileTop,
				_tileSize, _tileSize,
				0, 0,
				_tileSize, _tileSize);
	}
}
