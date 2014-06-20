(function() {
  var $sidebarContainer, $weekDayContainer, currentTaskText, delay, devmode, log,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  devmode = true;

  log = function(m) {
    if (devmode) {
      return console.log(m);
    }
  };

  window.clearLocal = function() {
    return localStorage.clear();
  };

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };


  /*	
  	To Do:
  	
  	 -- CLEAR TIMEOUT WHEN MULTIPLE DELTED BEFORE 6000
  
  	 - Refactor templates using handlebars block helpers
  	 - Move templates out
  	 - Add update task name
  	 - Add "header" option
  	 - Find how to use jade with coffeescript
   */

  $weekDayContainer = $('.weekday-container');

  $sidebarContainer = $('.other-tasks-container');

  currentTaskText = '';

  $(function() {
    var DAYS, DIRECTIVES, KEYCODES, Router, Task, Tasks, Week_View, cmp, router, tasks, week_view;
    KEYCODES = {
      enter: 13,
      esc: 27
    };
    DIRECTIVES = {
      'Mon': '#day-mon',
      'mon': '#day-mon',
      'monday': '#day-mon',
      'Tue': '#day-tue',
      'tue': '#day-tue',
      'Wed': '#day-wed',
      'wed': '#day-wed',
      'Thur': '#day-thur',
      'thur': '#day-thur',
      'Fri': '#day-fri',
      'fri': '#day-fri',
      'od': '#onDeck',
      'onDeck': '#onDeck',
      'ondeck': '#onDeck',
      'backburner': '#backburner',
      'bb': '#backburner'
    };
    DAYS = {
      1: '#day-mon',
      2: '#day-tue',
      3: '#day-wed',
      4: '#day-thur',
      5: '#day-fri'
    };
    cmp = function(a, b) {
      var _ref;
      _ref = [a.get('order'), b.get('order')], a = _ref[0], b = _ref[1];
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    };
    Task = (function(_super) {
      __extends(Task, _super);

      function Task() {
        return Task.__super__.constructor.apply(this, arguments);
      }

      Task.prototype.defaults = {
        target: '#backBurner',
        detail: 'empty',
        order: '',
        complete: false
      };

      Task.prototype.initialize = function() {
        return this.on('remove', this.destroy);
      };

      return Task;

    })(Backbone.Model);
    Tasks = (function(_super) {
      __extends(Tasks, _super);

      function Tasks() {
        return Tasks.__super__.constructor.apply(this, arguments);
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
      var getTaskId, inputTaskInputVal, updateTaskActive;

      __extends(Week_View, _super);

      function Week_View() {
        return Week_View.__super__.constructor.apply(this, arguments);
      }

      Week_View.prototype.el = $('body');

      Week_View.prototype.clickStatus = false;

      Week_View.prototype.lastDeletedTask = '';

      Week_View.prototype.taskInputWrapper = '.newTask';

      Week_View.prototype.taskInput = '#newTaskInput';

      Week_View.prototype.onDeck = '#onDeck';

      Week_View.prototype.onDeckList = '#onDeck ul';

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
          "keypress": "keyPress",
          "keyup": "keyUp",
          "click .delete": "deleteTask",
          "click a[data-action=undo]": "undoTask",
          "dblclick .item-detail": "updateTask"
        };
      };

      Week_View.prototype.template_week = Handlebars.compile($("#template_week").html());

      Week_View.prototype.template_sidebar = Handlebars.compile($("#template_sidebar").html());

      Week_View.prototype.render = function() {
        var backburner, backburnerCollection, friday, fridayCollection, monday, mondayCollection, ondeck, ondeckCollection, thursday, thursdayCollection, tuesday, tuesdayCollection, wednesday, wednesdayCollection;
        ondeck = this.collection.where({
          target: '#onDeck'
        }).sort(cmp);
        backburner = this.collection.where({
          target: '#backburner'
        }).sort(cmp);
        monday = this.collection.where({
          target: '#day-mon'
        }).sort(cmp);
        tuesday = this.collection.where({
          target: '#day-tue'
        }).sort(cmp);
        wednesday = this.collection.where({
          target: '#day-wed'
        }).sort(cmp);
        thursday = this.collection.where({
          target: '#day-thur'
        }).sort(cmp);
        friday = this.collection.where({
          target: '#day-fri'
        }).sort(cmp);
        ondeckCollection = new Tasks(ondeck);
        backburnerCollection = new Tasks(backburner);
        mondayCollection = new Tasks(monday);
        tuesdayCollection = new Tasks(tuesday);
        wednesdayCollection = new Tasks(wednesday);
        thursdayCollection = new Tasks(thursday);
        fridayCollection = new Tasks(friday);
        $sidebarContainer.html(this.template_sidebar({
          onDeckTasks: ondeckCollection.toJSON(),
          backBurnerTasks: backburnerCollection.toJSON()
        }));
        $weekDayContainer.html(this.template_week({
          monTasks: mondayCollection.toJSON(),
          tueTasks: tuesdayCollection.toJSON(),
          wedTasks: wednesdayCollection.toJSON(),
          thurTasks: thursdayCollection.toJSON(),
          friTasks: fridayCollection.toJSON()
        }));
        return this.sortablize();
      };

      getTaskId = function(task) {
        return $(task.currentTarget).closest('li').data('id');
      };

      Week_View.prototype.deleteTask = function(e) {
        var _taskId;
        _taskId = getTaskId(e);
        this.undoShow(_taskId);
        this.lastDeletedTask = this.collection.get(_taskId);
        return tasks.removeTask(_taskId);
      };

      Week_View.prototype.undoTask = function(e) {
        tasks.create(this.lastDeletedTask);
        return this.messageClear();
      };

      Week_View.prototype.updateTask = function(e) {
        var target;
        log('update');
        target = $(e.currentTarget);
        currentTaskText = $(e.currentTarget).text();
        return this.updateTaskInput(currentTaskText, target);
      };

      Week_View.prototype.updateTaskInput = function(text, target) {
        var inputHTML;
        log('tearget: ');
        log($(target));
        inputHTML = "<input class='input-task-update empty-input' type='text' value='" + text + "'>";
        $(target).empty().append(inputHTML);
        return $('.input-task-update').focus();
      };

      Week_View.prototype.addTask = function(obj) {
        var detail, dir, newTask;
        dir = obj.directive;
        detail = obj.detail;
        obj.order = $(dir).find('li').length;
        return newTask = tasks.create({
          target: obj.directive,
          detail: obj.detail,
          order: obj.order
        }, {
          success: (function(_this) {
            return function(response) {
              return _this.render();
            };
          })(this)
        });
      };

      Week_View.prototype.fetchStoredCollections = function() {
        var p;
        p = this.collection.fetch();
        return p.done((function(_this) {
          return function() {
            _.each(_this.collection.models, (function(item) {}), _this);
          };
        })(this));
      };

      Week_View.prototype.messageClear = function() {
        return $('.messages').empty();
      };

      Week_View.prototype.messageUpdate = function(obj) {
        var html;
        html = "<a href='#' data-id='" + obj.id + "' data-action='" + obj.action + "'>" + obj.message + "</a>";
        $('.messages').empty().append(html).addClass('show');
        return delay(6000, (function(_this) {
          return function() {
            return _this.messageClear();
          };
        })(this));
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
        return $('.sortable').sortable({
          connectWith: ".sortable",
          refreshPositions: true,
          update: (function(_this) {
            return function() {
              return _this.updateOrder();
            };
          })(this)
        });
      };

      Week_View.prototype.updateOrder = function() {
        var updateObj;
        updateObj = {};
        return $('.task-list').each(function() {
          var list;
          return list = $(this).find('.sortable li').each(function(index) {
            var _id, _item, _order, _target, _task;
            _task = $(this).find('.item-detail').text();
            _id = $(this).data('id');
            _order = Number(index);
            _target = '#' + $(this).closest('.task-list').attr('id');
            _item = tasks.get(_id);
            return _item.save({
              order: _order,
              target: _target
            });
          });
        });
      };

      inputTaskInputVal = function() {
        return $('.input-task-update').val();
      };

      updateTaskActive = function() {
        return $('.input-task-update').length;
      };

      Week_View.prototype.newTaskInputHide = function() {
        this.searchStatus = false;
        $(this.taskInputWrapper).hide();
        $(this.taskInput).val('');
        return this.clickStatus = false;
      };

      Week_View.prototype.newTaskInputShow = function() {
        this.searchStatus = true;
        $(this.taskInputWrapper).show();
        $(this.taskInput).focus();
        return this.clickStatus = true;
      };

      Week_View.prototype.keyPress = function(key) {
        var updateDetail, _id, _item;
        if (updateTaskActive()) {
          if (key.keyCode === KEYCODES.enter) {
            updateDetail = $('.input-task-update').val();
            _id = $('.input-task-update').closest('li').data('id');
            _item = tasks.get(_id);
            _item.save({
              detail: updateDetail
            });
            return this.render();
          }
          return;
        }
        if (key.keyCode === KEYCODES.enter) {
          return this.keyComplete();
        }
        return this.newTaskInputShow();
      };

      Week_View.prototype.keyUp = function(key) {
        if (updateTaskActive()) {
          if (key.keyCode === KEYCODES.esc) {
            $('.input-task-update').remove();
            return this.render();
          }
        }
        if (key.keyCode === KEYCODES.esc && this.searchStatus) {
          return this.newTaskInputHide();
        }
      };

      Week_View.prototype.keyComplete = function() {
        var task, task_info;
        task = ($(this.taskInput).val()).trim();
        task_info = this.searchDirectives(task);
        this.addTask(task_info);
        return this.newTaskInputHide();
      };

      Week_View.prototype.searchDirectives = function(task) {
        var k, split_task, task_detail, task_directive, task_split, v, _count;
        split_task = task;
        task_split = task.split("--");
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
            directive: '#backburner',
            detail: task
          };
        }
      };

      Week_View.prototype.virginCheck = function() {
        if (this.collection.size() === 0) {
          tasks.create({
            target: '#day-mon',
            detail: 'I am a task for Monday! Imagine that!',
            order: 0
          });
          return this.render();
        } else {

        }
      };

      return Week_View;

    })(Backbone.View);
    week_view = new Week_View({
      collection: tasks
    });
    Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.initialize = function() {};

      return Router;

    })(Backbone.Router);
    return router = new Router;
  });

}).call(this);
