
$('#login-form').hide();
$('#header-buttons').load('/mapEditorHeader.html', function() {
	bindMapTitle();
});
$('#header-buttons').show();

var image = {
	bottom: new Image(),
 	middle: new Image(),
 	upper: new Image()
}

image.bottom.src = '/images/bottom.png';
image.middle.src = '/images/middle.png';
image.upper.src = '/images/upper.png';

image.bottom.onload = initBottomTiles;
image.middle.onload = initMiddleTiles;
image.upper.onload = initUpperTiles;

map.setImages(image);
initMap();

bindChecks();
bindKeyDown();