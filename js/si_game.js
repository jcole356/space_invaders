(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var Board = SI.Board = function(width, height) {
    this.width = width;
    this.height = height;
  };
  
  Board.prototype.blankGrid = function (width, height) {
    var grid = [];

    for (var i = 0; i < height; i++) {
      var row = [];
      for (var j = 0; j < width; j++) {
        row.push(".");
      }
      grid.push(row);
    }

    return grid;
  };

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.width, this.height);
  };
})();
