(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var Alien = SI.Alien = function(coord, board) {
    this.coord = coord;
    this.board = board;
  };

  /* Should eventually have several different symbols for different
  aliens */
  Alien.SYMBOL = "A";


  var Board = SI.Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.aliens = [];
    //Initalize the aliens
    for (var i = 0; i < 5; i++) {
      for (var j = 6; j < 18; j++) {
        new Alien([i, j], this);
        this.aliens.push([i, j]);
      }
    }
  };

  Board.BLANK_SYMBOL = ".";
  // Need to set the initial state of the invaders
  Board.prototype.blankGrid = function () {
    var grid = [];

    for (var i = 0; i < this.height; i++) {
      var row = [];
      for (var j = 0; j < this.width; j++) {
        row.push(".");
      }
      grid.push(row);
    }

    return grid;
  };

  // Board.prototype.render = function () {
  Board.prototype.render = function () {
    var grid = this.blankGrid(this.width, this.height);

    this.aliens.forEach(function (alien) {
      grid[alien[0]][alien[1]] = Alien.SYMBOL;
    });
  };

  // Going to need some sort of vaild position function
})();
