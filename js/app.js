(function() {
  var $onDeck, $onDeckList, $taskInput, $taskInputWrapper, KEYCODE_ENTER, KEYCODE_ESC, clickStatus, daysArr, log, searchStatus, _ref;

  log = function(m) {
    return console.log(m);
  };

  this.WM = (_ref = this.WM) != null ? _ref : {};

  KEYCODE_ENTER = 13;

  KEYCODE_ESC = 27;

  clickStatus = false;

  searchStatus = false;

  $taskInputWrapper = $('.newTask');

  $taskInput = $('#newTaskInput');

  $onDeck = $('.onDeck');

  $onDeckList = $('.onDeck ul');

  daysArr = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'today', 'tomorrow', 'od', 'bb'];

  this.WM.Events = (function() {
    var getTaskInput, setTaskInput;
    $('body').on('keypress', function() {
      if (!clickStatus) {
        return WM.View.showSearch();
      }
    });
    $('body').on('keypress', function(e) {
      if (e.keyCode === KEYCODE_ENTER) {
        return WM.View.newTask();
      }
    });
    $('body').on('keyup', function(e) {
      if (e.keyCode === KEYCODE_ESC && searchStatus) {
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

  this.WM.View = (function() {
    var hideSearch, newTask, showSearch;
    newTask = function() {
      var addTaskDay, day, dayIndex, split, task;
      task = $taskInput.val();
      split = task.split(':');
      day = split[0].toLowerCase();
      task = split[1];
      dayIndex = daysArr.indexOf(day);
      if (dayIndex >= 0) {
        addTaskDay = '.' + daysArr[dayIndex];
        $('.container').find(addTaskDay).find('ul').append("<li>" + task + "</li>");
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
