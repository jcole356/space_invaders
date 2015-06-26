(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  // Probably going to need to make use of the coord class like in
  // snake

  var Alien = SI.Alien = function(coord, board) {
    this.coord = coord;
    this.board = board;
    // this.dir = -1;
  };

  // Having trouble deciding how to specify a starting direction
  Alien.prototype.move = function () {
    this.coord[0] = this.coord[0] + this.board.downShift;
    this.coord[1] = this.coord[1] + (1 * this.board.dir);
  };

  // Should eventually have several different symbols for different
  // aliens
  Alien.SYMBOL = "A";

  var Board = SI.Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.dir = -1;
    this.downShift = 0;
    this.ship = new Ship([29, 0], this);
    this.aliens = [];
    this.lasers = [];
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

  // Lowest alien is 0 in second coord
  // Highest alien is 23 in second coord
  Board.prototype.alienAtEdge = function () {
    var atEdge = false;
    this.aliens.forEach(function(alien) {
      if (alien.coord[1] === 0 || alien.coord[1] === 22) {
        atEdge = true;
      }
    });
    return atEdge;
  };

  Board.prototype.gameOver = function () {
    var atBottom = false;
    this.aliens.forEach(function(alien) {
      if (alien.coord[0] === 29) {
        atBottom = true;
      }
    });

    return atBottom;
  };

  // Board.prototype.render = function () {
  Board.prototype.render = function () {
    var grid = this.blankGrid(this.width, this.height);
    grid[this.ship.coord[0]][this.ship.coord[1]] = Ship.SYMBOL;
    this.aliens.forEach(function (alien) {
      grid[alien.coord[0]][alien.coord[1]] = Alien.SYMBOL;
    });
  };

  // You can't toggle every time this happens
  // Need to determine the left most alien and only toggle on this.
  Board.prototype.toggleDirection = function () {
    this.dir = this.dir * -1;
    this.downShift = this.downShift + 1;
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

  var Laser = SI.Laser = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  Laser.prototype.move = function () {
    // debugger;
    this.coord[0] = this.coord[0] - 1;
    // debugger;
    // window.view.render();
  };

  Laser.SYMBOL = "L";

  var Ship = SI.Ship = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  Ship.SYMBOL = "S";

  Ship.prototype.move = function (dir) {
    var newCoord = this.coord[1] + (1 * dir);
    if (this.board.validPosition(newCoord)) {
      this.coord[1] = this.coord[1] + (1 * dir);
    }
    window.view.render();
  };

  Ship.prototype.shoot = function () {
    var laserCoord = [27, this.coord[1]];
    var laser = new Laser(laserCoord, this.board);
    this.board.lasers.push(laser);
    window.view.render();
    laser.move();
  };

})();
