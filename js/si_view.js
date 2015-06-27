(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var View = SI.View = function($el) {
    this.$el = $el;
    this.stepMillis = 1000;
    this.board = new SI.Board(23, 30);
    this.setupGrid();
    this.render();
    // Not sure if this will work
    this.changeInterval(this.stepMillis);

    // Alien interval
    // this.alienIntervalId = window.setInterval(
    //   this.alienStep.bind(this),
    //   this.stepMillis
    // );

    // Laser interval
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
    var shipCoord = [this.board.ship.coord];
    this.board.aliens.forEach(function (alien) {
      alienCoords.push(alien.coord);
    });
    this.board.lasers.forEach(function (laser) {
      laserCoords.push(laser.coord);
    });
    this.updateClasses(alienCoords, "alien");
    this.updateClasses(shipCoord, "ship");
    this.updateClasses(laserCoords, "laser");
  };

  // Toggle direction of the board if an alien is at a boundary.
  // Need to clear and reset the interval on downShift as well.
  // Maybe set this as an if else for downShift
  // May need to make an interval reset method
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
      this.stepMillis -= 100;
      this.changeInterval(this.stepMillis);
    } else if (!this.board.gameOver()) {
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

  // Make this one work with lasers
  View.prototype.laserStep = function () {
      this.board.lasers.forEach(function(laser) {
        laser.move();
      });
      this.render();
  };

  // Need to rewrite this to accept coordinates not alien objects
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
