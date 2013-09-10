var rightClick;
var leftClick;

var boxSize = 30;

var clicked = false;

$(document).ready(function() {
	$('.col-sm-1').mousedown(function(event) {
		event.preventDefault();
		if (event.which === 1) {
			leftClick = $(this).css("background-color");
			$('#leftClick').css("background-color", leftClick);
		} else if (event.which === 3) {
			rightClick = $(this).css("background-color");
			$('#rightClick').css("background-color", rightClick);
		}

	});

	$('.col-sm-1').bind("contextmenu", function(e) {
		e.preventDefault();
	});

	$('#map').bind("contextmenu", function(e) {
		e.preventDefault();
	});

	$('#map').mousedown(function(event) {
		clicked = true;
		var html;
		var x = Math.floor(event.offsetX / boxSize) * boxSize;
		var y = Math.floor(event.offsetY / boxSize) * boxSize;

		var c = document.getElementById("map");
		var ctx = c.getContext("2d");

		if (event.which === 1) {
			html = "Button: Left<br/>";

			ctx.fillStyle = leftClick;
			ctx.fillRect(x, y, boxSize, boxSize);

		} else if (event.which === 3) {
			html = "Button: Right<br/>";

			ctx.fillStyle = rightClick;
			ctx.fillRect(x, y, boxSize, boxSize);
		}
		$('#position').html(html + "X: " + x + " Y: " + y + "<br/>Clicked: " + clicked);
	});

	$('#map').mousemove(function(event) {
		if (clicked === true) {

			var html;
			var x = Math.floor(event.offsetX / boxSize) * boxSize;
			var y = Math.floor(event.offsetY / boxSize) * boxSize;

			var c = document.getElementById("map");
			var ctx = c.getContext("2d");

			if (event.which === 1) {
				html = "Button: Left<br/>";

				ctx.fillStyle = leftClick;
				ctx.fillRect(x, y, boxSize, boxSize);

			} else if (event.which === 3) {
				html = "Button: Right<br/>";

				ctx.fillStyle = rightClick;
				ctx.fillRect(x, y, boxSize, boxSize);
			}
			$('#position').html(html + "X: " + x + " Y: " + y + "<br/>Clicked: " + clicked);
		}
	});

	$('#map').mouseup(function(event) {
		clicked = false;
		var html = 'Mouse Up<br/>';
		var x = Math.floor(event.offsetX / boxSize) * boxSize;
		var y = Math.floor(event.offsetY / boxSize) * boxSize;
		$('#position').html(html + "X: " + x + " Y: " + y + "<br/>Clicked: " + clicked);
	});

});