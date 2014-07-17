(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Tasks = (function(_super) {
    __extends(Tasks, _super);

    function Tasks() {
      return Tasks.__super__.constructor.apply(this, arguments);
    }

    Tasks.prototype.url = '/';

    Tasks.prototype.model = App.Task;

    Tasks.prototype.localStorage = new Store("backbone-tasks");

    Tasks.prototype.removeTask = function(elements, options) {
      return this.remove(elements, options);
    };

    return Tasks;

  })(Backbone.Collection);

  window.tasks = new App.Tasks;

}).call(this);
