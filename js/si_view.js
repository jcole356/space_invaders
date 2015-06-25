(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var View = SI.View = function($el) {
    this.$el = $el;
    // this.stepMillis = 1000;
    // For troubleshooting
    this.stepMillis = 100;
    this.board = new SI.Board(23, 30);
    this.setupGrid();
    this.board.render();
    this.render();

    //Need to set up an interval in here
    this.intervalId = window.setInterval(
      this.step.bind(this),
      this.stepMillis
    );
  };

  View.prototype.render = function () {
    var alienCoords = [];
    var shipCoord = [this.board.ship.coord];
    this.board.aliens.forEach(function (alien) {
      alienCoords.push(alien.coord);
    })
    this.updateClasses(alienCoords, "alien");
    // debugger;
    this.updateClasses(shipCoord, "ship");
  };

  // Toggle direction the board if an alien is at a boundary.
  View.prototype.step = function () {
    if (this.board.alienAtEdge()) {
        this.board.toggleDirection();
        // This doesn't actually do anything
        this.stepMillis = this.stepMillis - 100;
    }
    if (!this.board.gameOver()) {
      this.board.aliens.forEach(function(alien) {
        alien.move();
      });
      this.board.downShift = 0;
      this.render();
    } else {
      alert("You Lose!");
      window.clearInterval(this.intervalId);
    }
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
