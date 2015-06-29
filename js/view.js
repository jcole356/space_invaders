(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var View = SI.View = function($el) {
    this.$el = $el;
    this.stepMillis = 1000;
    this.board = new SI.Board(24, 18);
    this.setupGrid();
    this.score = 0;
    this.alienMoveCount = 0;
    this.render();
    this.changeInterval(this.stepMillis);
    this.laserIntervalId = window.setInterval(
      this.laserStep.bind(this),
      300
    );
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.KEYS = {
    38: "Shoot",
    37: -1,
    39: 1
  };

  View.prototype.changeInterval = function (millis) {
    this.alienIntervalId = window.setInterval(
      this.alienStep.bind(this),
      millis
    );
  };

  View.prototype.handleKeyEvent = function (event) {
    if (event.keyCode === 38) {
      this.board.ship.shoot();
    } else if (event.keyCode === 37 || event.keyCode === 39) {
      this.board.ship.move(View.KEYS[event.keyCode]);
    }
  };

  View.prototype.render = function () {
    var alienCoords = [];
    var laserCoords = [];
    var alienLaserCoords = [];
    var bunkerCoords = [];
    var shipCoord = [this.board.ship.coord];
    this.board.aliens.forEach(function (alien) {
      alienCoords.push(alien.coord);
    });
    this.board.lasers.forEach(function (laser) {
      laserCoords.push(laser.coord);
    });
    this.board.alienLasers.forEach(function (alienLaser) {
      alienLaserCoords.push(alienLaser.coord);
    });
    this.board.bunkerBricks.forEach(function (bunkerBrick) {
      bunkerCoords.push(bunkerBrick.coord);
    });
    this.updateClasses(alienCoords, "alien");
    this.updateClasses(shipCoord, "ship");
    this.updateClasses(laserCoords, "laser");
    this.updateClasses(alienLaserCoords, "alien-laser");
    this.updateClasses(bunkerCoords, "bunker");
  };

  View.prototype.alienStep = function () {
    if (this.board.alienAtEdge()) {
      this.board.aliens.forEach(function(alien) {
        alien.downShift();
      });
      this.render();
      window.clearInterval(this.alienIntervalId);
      this.board.toggleDirection();
      this.board.aliens.forEach(function(alien) {
        alien.move();
      });
      // May want to add a setTimeOut to this...
      // Also need to figure out how to increment the speed in a
      // reasonable way.  May need a method that sets a max speed.
      this.stepMillis -= 25;
      this.changeInterval(this.stepMillis);
    } else if (!this.board.gameOver()) {
      // Count the moves between alien shots
      this.alienMoveCount++;
      if (this.alienMoveCount === 5) {
        this.alienMoveCount = 0;
        var randomAlien = this.board.randomAlien();
        randomAlien.shoot();
      }
      this.board.aliens.forEach(function(alien) {
        alien.move();
      });
      this.render();
    } else if (this.board.gameOver() === "lose") {
      alert("You Lose!");
      window.clearInterval(this.alienIntervalId);
    } else if (this.board.gameOver() === "win") {
      alert("You Win!");
      window.clearInterval(this.alienIntervalId);
    }
  };

  View.prototype.laserStep = function () {
      this.board.lasers.forEach(function(laser) {
        laser.move();
      });
      this.board.alienLasers.forEach(function(alienLaser) {
        alienLaser.move();
      });
      this.render();
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      var flatCoord = (coord[0] * this.board.width) + coord[1];
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.height; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.width; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }
    this.$el.html(html);
    this.$li = this.$el.find("li");
  };
})();
