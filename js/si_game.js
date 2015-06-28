(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  // Use this to check if alien is hit.
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

  var Alien = SI.Alien = function(coord, board) {
    this.coord = coord;
    this.board = board;
  };

  Alien.prototype.downShift = function () {
    this.coord[0]++;
  };

  Alien.prototype.move = function () {
    this.coord[1] = this.coord[1] + (1 * this.board.dir);
  };

  var Laser = SI.Laser = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  Laser.prototype.move = function () {
    var newCoord = [this.coord[0] - 1, this.coord[1]];
    var alien = this.board.isOccupied(newCoord);
    if (!alien && this.validPosition(newCoord)) {
      this.coord[0] = this.coord[0] - 1;
    } else if (alien) {
      // This could be moved to another function isHit
      this.board.remove(this);
      this.board.remove(alien);
      window.view.score += 10;
      $("#score").html(window.view.score);
    } else {
      this.board.remove(this);
    }
  };

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

  Ship.prototype.move = function (dir) {
    var newCoord = this.coord[1] + (1 * dir);
    if (this.validPosition(newCoord)) {
      this.coord[1] = this.coord[1] + (1 * dir);
    }
    window.view.render();
  };

  Ship.prototype.shoot = function () {
    var laserCoord = [(this.coord[0] - 1), this.coord[1]];
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
