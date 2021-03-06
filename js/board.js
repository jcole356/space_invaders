(function () {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var Board = SI.Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.dir = -1;
    this.ship = new SI.Ship([(this.height - 1), 0], this);
    this.aliens = [];
    this.bunkerBricks = [];
    this.lasers = [];
    this.alienLasers = [];
    this.shipLasers = [];
    this.setupBunkers();
    // Initalize the aliens
    // Alien A style first
    for (var i = 0; i < 1; i++) {
      for (var j = 6; j < 18; j++) {
        var alienA = new SI.AlienA([i, j], this);
        this.aliens.push(alienA);
      }
    }
    // Alien B style second
    for (i; i < 3; i++) {
      for (var k = 6; k < 18; k++) {
        var alienB = new SI.AlienB([i, k], this);
        this.aliens.push(alienB);
      }
    }
    // Alien C style third
    for (i; i < 5; i++) {
      for (var l = 6; l < 18; l++) {
        var alienC = new SI.AlienC([i, l], this);
        this.aliens.push(alienC);
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
    this.aliens.forEach(function(alien) {
      if (alien.coord[0] === this.height - 1 || this.ship === null) {
        gameState = "lose";
      }
    }.bind(this));

    return gameState;
  };

  // Need to generalize this for bunkers or aliens
  Board.prototype.isOccupied = function (coord) {
    var objectAtLocation = null;
    this.aliens.forEach(function(alien) {
      if (alien.coord.equals(coord)) {
        objectAtLocation = alien;
        return objectAtLocation;
      }
    });
    this.bunkerBricks.forEach(function(bunkerBrick) {
      if (bunkerBrick.coord.equals(coord)) {
        objectAtLocation = bunkerBrick;
        return objectAtLocation;
      }
    });
    if (this.ship.coord.equals(coord)) {
      objectAtLocation = this.ship;
      return objectAtLocation;
    }
    return objectAtLocation;
  };

  // This has to be fixed keep better track of bottom row aliens
  Board.prototype.randomAlien = function () {
    var bottomRowAliens = [];
    var bottomAlienRow = 0;
    this.aliens.forEach(function(alien) {
      if (alien.coord[0] > bottomAlienRow) {
        bottomAlienRow = alien.coord[0];
      }
    });
    this.aliens.forEach(function(alien) {
      if (alien.coord[0] === bottomAlienRow) {
        bottomRowAliens.push(alien);
      }
    }.bind(this));
    var randomAlienIdx = Math.floor(Math.random() * bottomRowAliens.length);
    var randomAlien = bottomRowAliens[randomAlienIdx];
    return randomAlien;
  };

  // Removes the object from the board.
  Board.prototype.remove = function (object) {
    if (object instanceof SI.Laser) {
      this.lasers.splice(this.lasers.indexOf(object), 1);
    } else if (object instanceof SI.Alien) {
      this.aliens.splice(this.aliens.indexOf(object), 1);
    } else if (object instanceof SI.AlienLaser) {
      this.alienLasers.splice(this.alienLasers.indexOf(object), 1);
    } else if (object instanceof BunkerBrick) {
      this.bunkerBricks.splice(this.bunkerBricks.indexOf(object), 1);
    } else if (object instanceof SI.Ship) {
      this.ship = null;
    }
  };

  //Initalize the bunkers
  Board.prototype.setupBunkers = function () {
    // Set bunker cols in an array
    var bunkerCols = [4, 5, 11, 12, 18, 19];
    for (var i = this.height - 5; i < this.height - 3; i++) {
      for (var j = 0; j < bunkerCols.length; j++) {
        var bunkerBrick = new BunkerBrick([i, bunkerCols[j]], this);
        this.bunkerBricks.push(bunkerBrick);
      }
    }
  };

  Board.prototype.toggleDirection = function () {
    this.dir = this.dir * -1;
  };

  // Class for the bunkers
  // Need to track how many times the bunker gets hit
  // 4 hits should break a brick
  var BunkerBrick = SI.BunkerBrick = function (coord, board) {
    this.coord = coord;
    this.board = board;
    this.hits = 0;
  };

  BunkerBrick.prototype.remove = function () {
    if (this.hits === 4) {
      this.board.remove(this);
    }
  };
})();
