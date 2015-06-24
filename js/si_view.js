(function() {
  if (typeof SI === "undefined") {
    window.SI = {};
  }

  var View = SI.View = function($el) {
    this.$el = $el;
    this.board = new SI.Board(22, 10);
    this.setupGrid();

    //Need to set up an interval in here
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
  };



})();
