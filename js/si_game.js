(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  // This seems to be working.
  Array.prototype.equals = function (array) {
    if (this.length !== array.length) {
      return false;
    }
    for (var i = 0; i < this.length; i++) {
      if (this[i] !== array[i]) {
        return false;
      }
    }

    return true;
  };

  // May need to make use of the coord class like in snake
  var Alien = SI.Alien = function(coord, board) {
    this.coord = coord;
    this.board = board;
  };

  Alien.prototype.move = function () {
    this.coord[0] = this.coord[0] + this.board.downShift;
    this.coord[1] = this.coord[1] + (1 * this.board.dir);
  };

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

  // Make this work for win or lose
  Board.prototype.gameOver = function () {
    var gameState = null;
    if (this.aliens.length === 0) {
      gameState = "win";
    }
    this.aliens.forEach(function(alien) {
      if (alien.coord[0] === 29) {
        gameState = "lose";
      }
    });

    return gameState;
  };

  Board.prototype.isOccupied = function (coord) {
    var alienAtLocation = null;
    this.aliens.forEach(function(alien) {
      if (alien.coord.equals(coord)) {
        alienAtLocation = alien;
      }
    });

    return alienAtLocation;
  };

  // Removes the object from the board.
  Board.prototype.remove = function (object) {
    if (object instanceof SI.Laser) {
      this.lasers.splice(this.lasers.indexOf(object), 1);
    } else if (object instanceof SI.Alien) {
      this.aliens.splice(this.aliens.indexOf(object), 1);
    }
  };

  Board.prototype.toggleDirection = function () {
    this.dir = this.dir * -1;
    this.downShift = this.downShift + 1;
  };

  var Laser = SI.Laser = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  // Need to remove the lasers once the reach the end of the screen
  Laser.prototype.move = function () {
    var newCoord = [this.coord[0] - 1, this.coord[1]];
    var alien = this.board.isOccupied(newCoord);
    if (!alien && this.validPosition(newCoord)) {
      this.coord[0] = this.coord[0] - 1;
    } else {
      this.board.remove(this);
      this.board.remove(alien);
    }
  };

  Laser.SYMBOL = "L";

  Laser.prototype.validPosition = function (coord) {
    if (coord[0] >= 0) {
      return true;
    } else {
      return false;
    }
  };

  var Ship = SI.Ship = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  Ship.SYMBOL = "S";

  Ship.prototype.move = function (dir) {
    var newCoord = this.coord[1] + (1 * dir);
    if (this.validPosition(newCoord)) {
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

  Ship.prototype.validPosition = function (coord) {
    if (coord >= 0 && coord <= 22) {
      return true;
    }else {
      return false;
    }
  };
})();


  // Board.prototype.render = function () {
  //   var grid = this.blankGrid(this.width, this.height);
  //   grid[this.ship.coord[0]][this.ship.coord[1]] = Ship.SYMBOL;
  //   this.aliens.forEach(function (alien) {
  //     grid[alien.coord[0]][alien.coord[1]] = Alien.SYMBOL;
  //   });
  // };
