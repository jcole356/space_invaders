(function () {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var Board = SI.Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.dir = -1;
    this.topAlienRow = 0;
    this.ship = new SI.Ship([(this.height - 1), 0], this);
    this.aliens = [];
    this.lasers = [];
    //Initalize the aliens
    for (var i = 0; i < 5; i++) {
      for (var j = 6; j < 18; j++) {
        var alien = new SI.Alien([i, j], this);
        this.aliens.push(alien);
      }
    }
  };

  Board.prototype.alienAtEdge = function () {
    var atEdge = false;
    this.aliens.forEach(function(alien) {
      if (alien.coord[1] === 0 || alien.coord[1] === (this.width - 1)) {
        atEdge = true;
      }
    }.bind(this));
    return atEdge;
  };

  // Need to set the initial state of the invaders
  Board.prototype.blankGrid = function () {
    var grid = [];
    for (var i = 0; i < this.height; i++) {
      var row = [];
      for (var j = 0; j < this.width; j++) {
        row.push("");
      }
      grid.push(row);
    }

    return grid;
  };

  // Evaluates win or loss
  Board.prototype.gameOver = function () {
    var gameState = null;
    if (this.aliens.length === 0) {
      gameState = "win";
    }
    // Not sure why this stopped working.
    this.aliens.forEach(function(alien) {
      if (alien.coord[0] === this.height - 1) {
        gameState = "lose";
      }
    }.bind(this));

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
  };
})();
