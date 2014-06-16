(function() {
  var delay, devmode, log,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  devmode = true;

  log = function(m) {
    if (devmode) {
      return console.log(m);
    }
  };

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  $(function() {
    var DIRECTIVES, KEYCODES, Task, Tasks, Week_View, task, tasks, week_view, _ref, _ref1, _ref2;
    KEYCODES = {
      enter: 13,
      esc: 27
    };
    DIRECTIVES = {
      'Mon': '.mon',
      'mon': '.mon',
      'monday': '.mon',
      'Tue': 'tue',
      'tue': '.tue',
      'Wed': '.wed',
      'wed': '.wed',
      'Thur': '.thur',
      'thur': '.thur',
      'Fri': '.fri',
      'fri': '.fri',
      'today': '.today',
      'td': '.today',
      'tomorrow': '.tomorrow',
      'tom': '.tomorrow',
      'od': '.onDeck',
      'onDeck': '.onDeck',
      'ondeck': '.onDeck',
      'backburner': '.backburner',
      'bb': '.backburner'
    };
    Task = (function(_super) {
      __extends(Task, _super);

      function Task() {
        _ref = Task.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Task.prototype.defaults = {
        target: '.backBurner',
        detail: 'empty',
        order: '',
        complete: false
      };

      Task.prototype.initialize = function() {
        return this.on('remove', this.destroy);
      };

      return Task;

    })(Backbone.Model);
    task = new Task;
    Tasks = (function(_super) {
      __extends(Tasks, _super);

      function Tasks() {
        _ref1 = Tasks.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Tasks.prototype.url = '/';

      Tasks.prototype.model = Task;

      Tasks.prototype.localStorage = new Store("backbone-tasks");

      Tasks.prototype.removeTask = function(elements, options) {
        return this.remove(elements, options);
      };

      return Tasks;

    })(Backbone.Collection);
    tasks = new Tasks;
    Week_View = (function(_super) {
      __extends(Week_View, _super);

      function Week_View() {
        _ref2 = Week_View.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      Week_View.prototype.el = $('body');

      Week_View.prototype.clickStatus = false;

      Week_View.prototype.lastDeletedTask = '';

      Week_View.prototype.taskInputWrapper = '.newTask';

      Week_View.prototype.taskInput = '#newTaskInput';

      Week_View.prototype.onDeck = '.onDeck';

      Week_View.prototype.onDeckList = '.onDeck ul';

      Week_View.prototype.today = '';

      Week_View.prototype.initialize = function() {
        this.collection.on('add', this.render, this);
        this.collection.on('remove', this.render, this);
        this.fetchStoredCollections();
        this.virginCheck();
        return this.sortablize();
      };

      Week_View.prototype.events = function() {
        return {
          "keypress": "searchKeyPress",
          "keyup": "searchKeyUp",
          "click .delete": "deleteTask",
          "click a[data-action=undo]": "undoTask"
        };
      };

      Week_View.prototype.template_week = Handlebars.compile($("#template_week").html());

      Week_View.prototype.template_sidebar = Handlebars.compile($("#template_sidebar").html());

      Week_View.prototype.render = function() {
        var backburner, backburnerCollection, friday, fridayCollection, monday, mondayCollection, ondeck, ondeckCollection, thursday, thursdayCollection, tuesday, tuesdayCollection, wednesday, wednesdayCollection;
        ondeck = this.collection.where({
          target: '.onDeck'
        });
        backburner = this.collection.where({
          target: '.backburner'
        });
        monday = this.collection.where({
          target: '.mon'
        });
        tuesday = this.collection.where({
          target: '.tue'
        });
        wednesday = this.collection.where({
          target: '.wed'
        });
        thursday = this.collection.where({
          target: '.thur'
        });
        friday = this.collection.where({
          target: '.fri'
        });
        ondeckCollection = new Tasks(ondeck);
        backburnerCollection = new Tasks(backburner);
        mondayCollection = new Tasks(monday);
        tuesdayCollection = new Tasks(tuesday);
        wednesdayCollection = new Tasks(wednesday);
        thursdayCollection = new Tasks(thursday);
        fridayCollection = new Tasks(friday);
        $('#sidebar').html(this.template_sidebar({
          onDeckTasks: ondeckCollection.toJSON(),
          backBurnerTasks: backburnerCollection.toJSON()
        }));
        $('.week').html(this.template_week({
          monTasks: mondayCollection.toJSON(),
          tueTasks: tuesdayCollection.toJSON(),
          wedTasks: wednesdayCollection.toJSON(),
          thurTasks: thursdayCollection.toJSON(),
          friTasks: fridayCollection.toJSON()
        }));
        this.sortablize();
        return log(this.collection);
      };

      Week_View.prototype.deleteTask = function(e) {
        var _task, _taskId;
        _task = $(e.currentTarget);
        _taskId = $(_task).data('id');
        this.undoShow(_taskId);
        this.lastDeletedTask = this.collection.get(_taskId);
        return tasks.removeTask(_taskId);
      };

      Week_View.prototype.undoTask = function(e) {
        tasks.create(this.lastDeletedTask);
        return this.messageClear();
      };

      Week_View.prototype.addTask = function(obj) {
        var detail, dir, newTask,
          _this = this;
        dir = obj.directive;
        detail = obj.detail;
        return newTask = tasks.create({
          target: obj.directive,
          detail: obj.detail
        }, {
          success: function(response) {
            return _this.render();
          }
        });
      };

      Week_View.prototype.fetchStoredCollections = function() {
        var p,
          _this = this;
        p = this.collection.fetch();
        return p.done(function() {
          _.each(_this.collection.models, (function(item) {}), _this);
        });
      };

      Week_View.prototype.messageClear = function() {
        return $('.messages').empty();
      };

      Week_View.prototype.messageUpdate = function(obj) {
        var html,
          _this = this;
        html = "<a href='#' data-id='" + obj.id + "' data-action='" + obj.action + "'>" + obj.message + "</a>";
        $('.messages').empty().append(html).addClass('show');
        return delay(6000, function() {
          return _this.messageClear();
        });
      };

      Week_View.prototype.undoShow = function(id) {
        var obj;
        obj = {
          id: id,
          message: 'Undo',
          action: 'undo'
        };
        return this.messageUpdate(obj);
      };

      Week_View.prototype.sortablize = function() {
        var _this = this;
        $('.sortable').sortable({
          connectWith: ".sortable"
        });
        return $('.sortable').droppable({
          drop: function() {
            return _this.updateOrder();
          }
        });
      };

      Week_View.prototype.updateOrder = function() {
        return log('update the order');
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
        if (key.keyCode === KEYCODES.enter) {
          return this.searchComplete();
        }
        return this.searchShow();
      };

      Week_View.prototype.searchKeyUp = function(key) {
        if (key.keyCode === KEYCODES.esc && this.searchStatus) {
          return this.searchHide();
        }
      };

      Week_View.prototype.searchComplete = function() {
        var task_info;
        task = ($(this.taskInput).val()).trim();
        task_info = this.searchDirectives(task);
        this.addTask(task_info);
        return this.searchHide();
      };

      Week_View.prototype.searchDirectives = function(task) {
        var k, split_task, task_detail, task_directive, task_split, v, _count;
        split_task = task;
        task_split = task.split(":");
        task_directive = task_split[0];
        task_detail = task_split[1];
        _count = 0;
        for (k in DIRECTIVES) {
          v = DIRECTIVES[k];
          if (k === task_directive) {
            _count++;
            return {
              directive: v,
              detail: task_detail
            };
          }
        }
        if (_count === 0) {
          return {
            directive: '.backburner',
            detail: task
          };
        }
      };

      Week_View.prototype.virginCheck = function() {
        if (this.collection.size() === 0) {
          tasks.create({
            target: '.mon',
            detail: 'I am a task for Monday!',
            order: 0
          });
          return this.render();
        } else {

        }
      };

      return Week_View;

    })(Backbone.View);
    return week_view = new Week_View({
      collection: tasks
    });
  });

}).call(this);
