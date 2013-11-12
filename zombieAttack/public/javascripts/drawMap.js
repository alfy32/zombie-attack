
var image = {
    bottom: new Image(),
    middle: new Image(),
    upper: new Image(),
    player: new Image()
}

image.bottom.src = '/images/bottom.png';
image.middle.src = '/images/middle.png';
image.upper.src = '/images/upper.png';
image.player.src = '/images/player.png';

function drawMap(canvasId, map) {
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
    drawLayer(map, context, 'bottom');
    drawLayer(map, context, 'middle');
    drawLayer(map, context, 'upper');
    drawTile(0, map.y, map.x, 'player');

    function clearCanvas() {
        context.fillStyle = "grey";
        context.fillRect(0,0,canvas.width, canvas.height);
    }

    function drawLayer(map, context, layer) {
        for(var row in map.data[layer]) {
            for(var col in map.data[layer][row]) {
                var imageNumber = +map.data[layer][row][col];
                drawTile(imageNumber, row, col, layer);
            }
        }
    }

    function drawTile(imageNumber, row, col, layer) {
        var imageLoc = {
            x: imageNumber % 8 * spriteTileSize.height,
            y: Math.floor(imageNumber / 8) * spriteTileSize.width
        };  

        var canvasLoc = {
            x: col * canvasTileSize.height,
            y: row * canvasTileSize.width
        };

        context.drawImage(
                image[layer], 
                imageLoc.x, imageLoc.y,
                spriteTileSize.width, spriteTileSize.height,
                canvasLoc.x, canvasLoc.y,
                canvasTileSize.width, canvasTileSize.height
            );
    }   
}