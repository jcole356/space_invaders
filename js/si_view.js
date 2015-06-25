(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var View = SI.View = function($el) {
    this.$el = $el;
    this.board = new SI.Board(23, 10);
    this.setupGrid();
    this.board.render();
    this.render();

    //Need to set up an interval in here
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );
  };

  View.STEP_MILLIS = 1000;

  View.prototype.render = function () {
    this.updateClasses(this.board.aliens, "alien");
  };

  // Need to toggel the direction for each alien  May want to make the
  // direction a property of the board.
  View.prototype.step = function () {
    if (this.board.alienAtEdge()) {
        SI.Alien.toggleDirection();
    }
    this.board.aliens.forEach(function(alien) {
      alien.move();
    });
    this.render();
  };

  View.prototype.updateClasses = function(aliens, className) {
    this.$li.filter("." + className).removeClass();

    aliens.forEach(function(alien){
      var flatCoord = (alien.coord[0] * this.board.width) + alien.coord[1];
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
