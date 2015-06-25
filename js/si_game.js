(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  // Probably going to need to make use of the coord class like in
  // snake

  var Alien = SI.Alien = function(coord, board) {
    this.coord = coord;
    this.board = board;
    this.dir = -1;
  };

  // Having trouble deciding how to specify a starting direction
  Alien.prototype.move = function () {
    var newCoord = this.coord[1] + (1 * this.dir);
    if (newCoord === 0 || newCoord === 23) {
      this.toggleDirection;
    }
    this.coord[1] = this.coord[1] + (1 * this.dir);
  };

  Alien.prototype.toggleDirection = function () {
    this.dir = dir * -1
  };

  // Should eventually have several different symbols for different
  // aliens
  Alien.SYMBOL = "A";
  Alien.START_DIRECTION = 1;


  var Board = SI.Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.aliens = [];
    //Initalize the aliens
    for (var i = 0; i < 5; i++) {
      for (var j = 6; j < 18; j++) {
        var alien = new Alien([i, j], this);
        this.aliens.push(alien);
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
      grid[alien.coord[0]][alien.coord[1]] = Alien.SYMBOL;
    });
  };

  // Currently only validates the horizontal plane for moving accross
  // the screen
  Board.prototype.validPosition = function (coord) {
    if (coord >= 0 && coord <= 22) {
      return true;
    }else {
      return false;
    }
  };
})();
