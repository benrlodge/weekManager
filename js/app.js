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
        detail: 'empty'
      };

      Task.prototype.initialize = function() {
        return _.bindAll(this, 'name_update');
      };

      Task.prototype.name_update = function() {
        var title;
        return title = task.get("title");
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

      return Task;

    })(Backbone.Model);
    task = new Task;
    Tasks = (function(_super) {
      __extends(Tasks, _super);

      function Tasks() {
        _ref1 = Tasks.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Tasks.prototype.model = Task;

      Tasks.prototype.initialize = function() {
        log('init the collectioonayy');
        this.on('add', this.newTask, this);
        return this.on('change', this.change, this);
      };

      Tasks.prototype.newTask = function(model) {
        log('i made me some collection!!!');
        log('welcome: ' + model.get('detail'));
        return log(model);
      };

      Tasks.prototype.change = function(model) {
        return log('model has been changed');
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

      Week_View.prototype.taskInputWrapper = '.newTask';

      Week_View.prototype.taskInput = '#newTaskInput';

      Week_View.prototype.onDeck = '.onDeck';

      Week_View.prototype.onDeckList = '.onDeck ul';

      Week_View.prototype.today = '';

      Week_View.prototype.template_week = Handlebars.compile($("#template_week").html());

      Week_View.prototype.initialize = function() {
        log('Init View');
        return this.collection.on('add', this.render, this);
      };

      Week_View.prototype.render = function() {
        var friday, fridayCollection, monday, mondayCollection, thursday, thursdayCollection, tuesday, tuesdayCollection, wednesday, wednesdayCollection;
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
        mondayCollection = new Tasks(monday);
        tuesdayCollection = new Tasks(tuesday);
        wednesdayCollection = new Tasks(wednesday);
        thursdayCollection = new Tasks(thursday);
        fridayCollection = new Tasks(friday);
        return $('.week').html(this.template_week({
          allTasks: this.collection.toJSON(),
          monTasks: mondayCollection.toJSON(),
          tueTasks: tuesdayCollection.toJSON(),
          wedTasks: wednesdayCollection.toJSON(),
          thurTasks: thursdayCollection.toJSON(),
          friTasks: fridayCollection.toJSON()
        }));
      };

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

      Week_View.prototype.addTask = function(obj) {
        var detail, dir;
        dir = obj.directive;
        detail = obj.detail;
        return tasks.add({
          target: obj.directive,
          detail: obj.detail
        });
      };

      return Week_View;

    })(Backbone.View);
    return week_view = new Week_View({
      collection: tasks
    });
  });

}).call(this);
