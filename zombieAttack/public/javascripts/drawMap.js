
var spriteImage = new Image();
spriteImage.src = '/images/bottom.png';

function drawMap(canvasId, spriteImage, map) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');

    var spriteTileSize = {
        width: 40, 
        height: 40
    };

    var scale = {
        x: map.width ? canvas.width/map.width : 40,
        y: map.height ? canvas.height/map.height : 40
    };

    var minScale = scale.x < scale.y ? scale.x : scale.y;

    var canvasTileSize = {
        width: minScale, 
        height: minScale
    };

    clearCanvas();
    drawLayer(map.data.bottom, context);

    function clearCanvas() {
        context.fillStyle = "grey";
        context.fillRect(0,0,canvas.width, canvas.height);
    }

    function drawLayer(layer, context) {
        for(var row in layer) {
            for(var col in layer[row]) {
                var imageNumber = +layer[row][col];
                drawTile(imageNumber, row, col);
            }
        }
    }

    function drawTile(imageNumber, row, col) {
        var imageLoc = {
            x: imageNumber % 8 * spriteTileSize.height,
            y: Math.floor(imageNumber / 8) * spriteTileSize.width
        };  

        var canvasLoc = {
            x: col * canvasTileSize.height,
            y: row * canvasTileSize.width
        };

        context.drawImage(spriteImage, 
                          imageLoc.x, imageLoc.y,
                          spriteTileSize.width, spriteTileSize.height,
                          canvasLoc.x, canvasLoc.y,
                          canvasTileSize.width, canvasTileSize.height);
    }   
}