(function() {
  var devmode, log,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  devmode = true;

  log = function(m) {
    if (devmode) {
      return console.log(m);
    }
  };

  $(function() {
    var Task, Tasks, Week_View, keycodes, task, _ref, _ref1, _ref2;
    keycodes = {
      enter: 13,
      esc: 27
    };
    Week_View = (function(_super) {
      __extends(Week_View, _super);

      function Week_View() {
        _ref = Week_View.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Week_View.prototype.el = $('body');

      Week_View.prototype.clickStatus = false;

      Week_View.prototype.taskInputWrapper = '.newTask';

      Week_View.prototype.taskInput = '#newTaskInput';

      Week_View.prototype.onDeck = '.onDeck';

      Week_View.prototype.onDeckList = '.onDeck ul';

      Week_View.prototype.today = '';

      Week_View.prototype.initialize = function() {
        log('i init the View');
        return this.render();
      };

      Week_View.prototype.render = function() {};

      Week_View.prototype.events = function() {
        return {
          "keypress": "searchKeyPress",
          "keyup": "searchKeyUp"
        };
      };

      Week_View.prototype.searchHide = function() {
        this.searchStatus = false;
        $(this.taskInputWrapper).hide();
        $(this.taskInput).val('');
        return this.clickStatus = false;
      };

      Week_View.prototype.searchShow = function() {
        this.searchStatus = true;
        $(this.taskInputWrapper).show();
        $(this.taskInput).focus();
        return this.clickStatus = true;
      };

      Week_View.prototype.searchKeyPress = function(key) {
        if (key.keyCode === keycodes.enter) {
          return this.searchComplete();
        }
        return this.searchShow();
      };

      Week_View.prototype.searchKeyUp = function(key) {
        if (key.keyCode === keycodes.esc && this.searchStatus) {
          return this.searchHide();
        }
      };

      Week_View.prototype.searchComplete = function() {
        var directives, task;
        task = ($(this.taskInput).val()).trim();
        directives = this.searchDirectives();
        return this.searchHide();
      };

      Week_View.prototype.searchDirectives = function() {
        return log('search directives');
      };

      Week_View.prototype.addTask = function(event) {
        var task, task_text;
        task_text = $("#task_input").val();
        log('Im a gonna add me some ' + task_text);
        return task = new Task({
          title: task_text
        });
      };

      return Week_View;

    })(Backbone.View);
    Week_View = new Week_View;
    Task = (function(_super) {
      __extends(Task, _super);

      function Task() {
        _ref1 = Task.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Task.prototype.defaults = {
        title: 'New task',
        complete: false
      };

      Task.prototype.initialize = function() {
        _.bindAll(this, 'name_update');
        return this.on("change:title", function(model) {
          return this.name_update();
        });
      };

      Task.prototype.name_update = function() {
        var title;
        title = task.get("title");
        return log("I updated my models title to: " + title);
      };

      Task.prototype.complete_task = function() {
        return this.set({
          complete: true
        });
      };

      Task.prototype.incomplete_task = function() {
        return this.set({
          complete: false
        });
      };

      Task.prototype.set_task = function(new_title) {
        return this.set({
          title: new_title
        });
      };

      return Task;

    })(Backbone.Model);
    task = new Task;
    return Tasks = (function(_super) {
      __extends(Tasks, _super);

      function Tasks() {
        _ref2 = Tasks.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      Tasks.prototype.model = Task;

      Tasks.prototype.initialize = function() {
        return log('init the model');
      };

      return Tasks;

    })(Backbone.Collection);
  });

}).call(this);
