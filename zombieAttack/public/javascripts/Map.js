
function Map(id) {
   this.map = document.getElementById(id);
   this.context = this.map.getContext("2d");
   this.boxSize = 25;
   this.setBoxSize = function (size) { 
      this.boxSize = size;
   }
   this.getBoxSize = function () {
      return this.boxSize;
   }
};

Map.prototype.getMap = function () {
   return this.map;
};

Map.prototype.getContext = function () {
   return this.context;
};



Map.prototype.drawRectangle = function (x,y,color) {
   this.context.fillStyle = color;
   this.context.fillRect(x, y, this.boxSize, this.boxSize);
}