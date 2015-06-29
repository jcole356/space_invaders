(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  // Use this to check if an object is hit.
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

  Function.prototype.inherits = function inherits(ParentClass) {
    function Surrogate () {};
    Surrogate.prototype = ParentClass.prototype;
    this.prototype = new Surrogate();
    this.prototype.constructor = this;
  };

  var Alien = SI.Alien = function() {
  };

  Alien.prototype.downShift = function () {
    this.coord[0]++;
  };

  Alien.prototype.move = function () {
    this.coord[1] = this.coord[1] + (1 * this.board.dir);
  };

  // Need to be able to shoot
  Alien.prototype.shoot = function () {
    var laserCoord = [(this.coord[0] + 1), this.coord[1]];
    var laser = new AlienLaser(laserCoord, this.board);
    this.board.alienLasers.push(laser);
    window.view.render();
    laser.move();
  };

  var AlienA = SI.AlienA = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  AlienA.inherits(Alien);

  var AlienLaser = SI.AlienLaser = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  // This might need to be split into a few smaller functions
  AlienLaser.prototype.move = function () {
    var newCoord = [this.coord[0] + 1, this.coord[1]];
    var objectAtLocation = this.board.isOccupied(newCoord);
    if (!objectAtLocation && this.validPosition(newCoord, this.board)) {
      this.coord[0] = this.coord[0] + 1;
    } else if (objectAtLocation instanceof SI.Ship) {
      // Need to end the game on this condition.
      this.board.remove(this);
      this.board.remove(objectAtLocation);
    } else if (objectAtLocation instanceof SI.BunkerBrick) {
      objectAtLocation.hits++;
      this.board.remove(this);
      objectAtLocation.remove();
    } else {
      this.board.remove(this);
    }
  };

  AlienLaser.prototype.validPosition = function (coord, board) {
    if (coord[0] <= (board.height - 1)) {
      return true;
    } else {
      return false;
    }
  };

  var Laser = SI.Laser = function (coord, board) {
    this.coord = coord;
    this.board = board;
  };

  // This might need to be split into a few smaller functions
  Laser.prototype.move = function () {
    var newCoord = [this.coord[0] - 1, this.coord[1]];
    var objectAtLocation = this.board.isOccupied(newCoord);
    if (!objectAtLocation && this.validPosition(newCoord)) {
      this.coord[0] = this.coord[0] - 1;
    } else if (objectAtLocation instanceof SI.Alien) {
      this.board.remove(this);
      this.board.remove(objectAtLocation);
      window.view.score += 10;
      $("#score").html(window.view.score);
    } else if (objectAtLocation instanceof SI.BunkerBrick) {
      objectAtLocation.hits++;
      this.board.remove(this);
      objectAtLocation.remove();
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

  // Need to restrict lasers to one at a time
  Ship.prototype.shoot = function () {
    if (this.board.lasers.length === 0) {
      var laserCoord = [(this.coord[0]), this.coord[1]];
      var laser = new Laser(laserCoord, this.board);
      this.board.lasers.push(laser);
      laser.move();
    }
  };

  Ship.prototype.validPosition = function (coord) {
    if (coord >= 0 && coord <= 22) {
      return true;
    }else {
      return false;
    }
  };
})();
