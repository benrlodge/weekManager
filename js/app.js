(function() {
  var $onDeck, $onDeckList, $taskInput, $taskInputWrapper, clickStatus, daysArr, devmode, keycodes, log, searchStatus, shortcodes, today, weekday, _ref;

  devmode = true;

  log = function(m) {
    if (devmode) {
      return console.log(m);
    }
  };

  this.WM = (_ref = this.WM) != null ? _ref : {};

  clickStatus = false;

  searchStatus = false;

  $taskInputWrapper = $('.newTask');

  $taskInput = $('#newTaskInput');

  $onDeck = $('.onDeck');

  $onDeckList = $('.onDeck ul');

  today = '';

  daysArr = ['mon', 'tue', 'wed', 'thur', 'fri', 'today', 'tomorrow', 'od', 'bb', 'td'];

  keycodes = {
    enter: 13,
    esc: 27
  };

  shortcodes = {
    'mon': '.mon',
    'monday': '.mon',
    'tue': '.tue',
    'wed': '.wed',
    'thur': '.thur',
    'fri': '.fri',
    'today': '.today',
    'td': '.today',
    'tomorrow': '.tomorrow',
    'tom': '.tomorrow',
    'od': '.onDeck',
    'bb': '.backburner'
  };

  weekday = {
    '0': 'sun',
    '1': 'mon',
    '2': 'tue',
    '3': 'wed',
    '4': 'thur',
    '5': 'frid',
    '6': 'sat'
  };

  this.WM.Events = (function() {
    var getTaskInput, setTaskInput;
    $('body').on('keypress', function() {
      if (!clickStatus) {
        return WM.View.showSearch();
      }
    });
    $('body').on('keypress', function(e) {
      if (e.keyCode === keycodes.enter) {
        return WM.View.newTask();
      }
    });
    $('body').on('keyup', function(e) {
      if (e.keyCode === keycodes.esc && searchStatus) {
        return WM.View.hideSearch();
      }
    });
    getTaskInput = function() {
      return $taskInput.val();
    };
    return setTaskInput = function(val) {
      return $taskInput(val);
    };
  })();

  this.WM.Sortable = (function() {
    var config, init;
    config = function() {
      $(".sortable").sortable({
        connectWith: '.sortable'
      });
      return $(".sortable").disableSelection();
    };
    init = function() {
      log('init this shit');
      return config();
    };
    return {
      init: init
    };
  })();

  $(function() {
    return WM.Sortable.init();
  });

  this.WM.Model = (function() {
    var count, countDecr, countIncr, generateTaskID, getTask, getTime, init, setTask;
    count = 0;
    countIncr = function() {
      return count++;
    };
    countDecr = function() {
      return count--;
    };
    generateTaskID = function() {
      return 'task_' + count;
    };
    getTask = function(model) {
      return localStorage.getItem(model);
    };
    setTask = function(id, model) {
      var date, taskObj;
      date = getTime();
      taskObj = {
        'task': model,
        'date': date
      };
      localStorage.setItem(id, JSON.stringify(taskObj));
      return countIncr();
    };
    getTime = function() {
      return new Date();
    };
    init = function() {
      var day;
      today = getTime();
      day = today.getDay();
      today = '.' + weekday[day];
      return log(today);
    };
    return {
      generateTaskID: generateTaskID,
      setTask: setTask,
      init: init
    };
  })();

  WM.Model.init();

  this.WM.View = (function() {
    var hideSearch, newTask, showSearch;
    newTask = function() {
      var addTaskDay, day, dayIndex, id, split, task;
      task = ($taskInput.val()).trim();
      split = task.split(':');
      day = split[0].toLowerCase();
      task = split[1];
      log('dayIndex is:');
      log(dayIndex = daysArr.indexOf(day));
      if (dayIndex >= 0) {
        addTaskDay = '.' + daysArr[dayIndex];
        id = WM.Model.generateTaskID();
        $('.container').find(addTaskDay).find('ul').append("<li id=" + id + "''>" + task + "</li>");
        WM.Model.setTask(id, task);
      }
      return hideSearch();
    };
    showSearch = function() {
      searchStatus = true;
      $taskInputWrapper.show();
      $taskInput.focus();
      return clickStatus = true;
    };
    hideSearch = function() {
      searchStatus = false;
      log('hide');
      $taskInputWrapper.hide();
      $taskInput.val('');
      return clickStatus = false;
    };
    return {
      newTask: newTask,
      showSearch: showSearch,
      hideSearch: hideSearch
    };
  })();

}).call(this);
