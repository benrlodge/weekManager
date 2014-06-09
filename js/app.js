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
    getTaskInput = function() {
      return $taskInput.val();
    };
    return setTaskInput = function(val) {
      return $taskInput(val);
    };
  })();

  this.WM.Events = (function() {
    var hideSearch, showSearch;
    $('body').on('keypress', function() {
      log('keypress');
      if (!clickStatus) {
        return showSearch();
      }
    });
    $('body').on('keypress', function(e) {
      var addTaskDay, day, dayIndex, split, task;
      if (e.keyCode === KEYCODE_ENTER) {
        log('Add new task');
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
      }
    });
    $('body').on('keyup', function(e) {
      if (e.keyCode === KEYCODE_ESC && searchStatus) {
        return hideSearch();
      }
    });
    showSearch = function() {
      searchStatus = true;
      $taskInputWrapper.show();
      $taskInput.focus();
      return clickStatus = true;
    };
    return hideSearch = function() {
      searchStatus = false;
      log('hide');
      $taskInputWrapper.hide();
      $taskInput.val('');
      return clickStatus = false;
    };
  })();

}).call(this);
