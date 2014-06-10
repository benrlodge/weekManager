log = (m) -> console.log m

@WM = @WM ? {}

KEYCODE_ENTER = 13
KEYCODE_ESC = 27

clickStatus = false
searchStatus = false

$taskInputWrapper = $('.newTask')
$taskInput = $('#newTaskInput')

$onDeck = $('.onDeck')
$onDeckList = $('.onDeck ul')

today = ''
daysArr = ['mon','tue','wed','thur','fri','today','tomorrow', 'od','bb']
weekday = 
	'0'	: 'sun'
	'1'	: 'mon'
	'2'	: 'tue'
	'3'	: 'wed'
	'4'	: 'thur'
	'5'	: 'frid'
	'6'	: 'sat'





@WM.Events = do ->

	$('body').on 'keypress', ->  WM.View.showSearch()  if !clickStatus 
	$('body').on 'keypress', (e) ->  WM.View.newTask() if e.keyCode is KEYCODE_ENTER
	$('body').on 'keyup', (e) ->  WM.View.hideSearch() if e.keyCode is KEYCODE_ESC and searchStatus
	
	getTaskInput = -> $taskInput.val()
	setTaskInput = (val) -> $taskInput(val)		
			 





@WM.Model = do ->

	count = 0

	countIncr = -> count++
	countDecr = -> count--
	generateTaskID = -> 
		return 'task_' + count

	getTask = (model) ->
		localStorage.getItem(model)

	setTask = (id, model) ->
		date = getTime()
		taskObj = 
			'task' : model
			'date' : date
		
		localStorage.setItem(id, JSON.stringify(taskObj))
		countIncr()


	getTime = ->
		new Date()
		# dd = today.getDate()
		# mm = today.getMonth()+1
		# yyyy = today.getFullYear()
		# return mm+'/'+dd+'/'+yyyy


	init = ->
		today = getTime()
		day = today.getDay()
		#store in global var
		today = '.'+weekday[day]

		log today


	generateTaskID: generateTaskID
	setTask: setTask
	init: init


WM.Model.init()






@WM.View = do ->

	newTask = ->
		task = ($taskInput.val()).trim()
		split = task.split(':')			

		day = split[0].toLowerCase()
		task = split[1]
		
		log 'dayIndex is:'
		log dayIndex = daysArr.indexOf(day)

		# If a day is chosen from weekday list
		if dayIndex >= 0

			addTaskDay = '.'+daysArr[dayIndex]

			# Add to week list
			id = WM.Model.generateTaskID()
			$('.container').find(addTaskDay).find('ul').append("<li id=#{id}''>#{task}</li>")
			WM.Model.setTask(id, task)

		hideSearch()



	showSearch = ->
		searchStatus = true
		$taskInputWrapper.show()
		$taskInput.focus()
		clickStatus = true



	hideSearch = ->
		searchStatus = false
		log 'hide'
		$taskInputWrapper.hide()
		$taskInput.val('')
		clickStatus = false



	newTask: newTask
	showSearch: showSearch
	hideSearch: hideSearch
