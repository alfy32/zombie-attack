define([],function(){
	var rightColor = 'white';
	var leftColor = 'black';

	var boxSize = 25;

	var clicked = false;

	var map = new Map('map');

	$(document).ready(function() {   
	   $('#blockSize').val(map.getBoxSize());
	   
	   $('#blockSize').change(function(event){
	      boxSize  = $(this).val();
	   });
		$('.col-sm-1').mousedown(function(event) {
			event.preventDefault();
			if (event.which === 1) {
				leftColor = $(this).css("background-color");
				$('#leftClick').css("background-color", leftColor);
			} else if (event.which === 3) {
				rightColor = $(this).css("background-color");
				$('#rightClick').css("background-color", rightColor);
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

			if (event.which === 1) {
				html = "Button: Left<br/>";

				drawRectangle('map', x, y, leftColor);

			} else if (event.which === 3) {
				html = "Button: Right<br/>";

	         drawRectangle('map', x, y, rightColor);
			}
			$('#position').html(html + "X: " + x + " Y: " + y + "<br/>Clicked: " + clicked);
		});

		$('#map').mousemove(function(event) {
			if (clicked === true) {

				var html;
				var x = Math.floor(event.offsetX / boxSize) * boxSize;
				var y = Math.floor(event.offsetY / boxSize) * boxSize;

				if (event.which === 1) {
					html = "Button: Left<br/>";
	            
	            drawRectangle('map', x, y, leftColor);

				} else if (event.which === 3) {
					html = "Button: Right<br/>";

	            drawRectangle('map', x, y, rightColor);
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

	function drawRectangle(id, x, y, color){
	   
	   var c = document.getElementById(id);
		var ctx = c.getContext("2d");
	         
	   ctx.fillStyle = color;
		ctx.fillRect(x, y, boxSize, boxSize);
	}

	function drawGrid(){
	   var c = document.getElementById("map");
		var ctx = c.getContext("2d");

	   ctx.beginPath();
	   ctx.moveTo(25, 0);
	   ctx.lineTo(25, 600);
	   ctx.stroke();
	}


	return {inti:init};
});