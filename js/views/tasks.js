(function() {
  var DIRECTIVES, KEYCODES, cmp, week_view,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KEYCODES = {
    enter: 13,
    esc: 27
  };

  DIRECTIVES = {
    'todo': '#todo',
    'doing': '#doing',
    'done': '#done'
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

  App.Week_View = (function(_super) {
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
        "dblclick .item-detail": "updateTask",
        "blur .item-detail": "hideUpdate"
      };
    };

    Week_View.prototype.template_week = Handlebars.compile($("#template_week").html());

    Week_View.prototype.render = function() {
      var doing, doingCollection, done, doneCollection, todo, todoCollection;
      todo = this.collection.where({
        target: '#todo'
      }).sort(cmp);
      doing = this.collection.where({
        target: '#doing'
      }).sort(cmp);
      done = this.collection.where({
        target: '#done'
      }).sort(cmp);
      todoCollection = new App.Tasks(todo);
      doingCollection = new App.Tasks(doing);
      doneCollection = new App.Tasks(done);
      $('.weekday-container').html(this.template_week({
        todoTasks: todoCollection.toJSON(),
        doingTasks: doingCollection.toJSON(),
        doneTasks: doneCollection.toJSON()
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
      var currentTaskText, target;
      target = $(e.currentTarget);
      currentTaskText = $(e.currentTarget).text();
      return this.updateTaskInput(currentTaskText, target);
    };

    Week_View.prototype.updateTaskInput = function(text, target) {
      var inputHTML;
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
        helper: "clone",
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
          this.hideUpdate();
        }
      }
      if (key.keyCode === KEYCODES.esc && this.searchStatus) {
        return this.newTaskInputHide();
      }
    };

    Week_View.prototype.hideUpdate = function() {
      $('.input-task-update').remove();
      return this.render();
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
          directive: '#todo',
          detail: task
        };
      }
    };

    Week_View.prototype.virginCheck = function() {
      if (this.collection.size() === 0) {
        tasks.create({
          target: '#todo',
          detail: 'I am an example task!',
          order: 0
        });
        tasks.create({
          target: '#todo',
          detail: 'Double click me to edit',
          order: 1
        });
        tasks.create({
          target: '#doing',
          detail: 'Delete me by clicking the x icon',
          order: 2
        });
        tasks.create({
          target: '#done',
          detail: 'drag and drop me to another column',
          order: 3
        });
        tasks.create({
          target: '#todo',
          detail: 'To create a new task, just start typing the column name followed by two dashes and then your message. For example typing: "todo--Do some karate kicks" without the quotes will create the following card:',
          order: 4
        });
        return tasks.create({
          target: '#todo',
          detail: 'Do some karate kicks',
          order: 4
        });
      }
    };

    return Week_View;

  })(Backbone.View);

  week_view = new App.Week_View({
    collection: window.tasks
  });

}).call(this);
