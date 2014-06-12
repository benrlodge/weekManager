devmode = true
log = (m) -> console.log m if devmode 

@WM = @WM ? {}


clickStatus = false
searchStatus = false

$taskInputWrapper = $('.newTask')
$taskInput = $('#newTaskInput')

$onDeck = $('.onDeck')
$onDeckList = $('.onDeck ul')


today = ''
daysArr = [
	'mon',
	'tue',
	'wed',
	'thur',
	'fri',
	'today',
	'tomorrow',
	'od',
	'bb',
	'td'
]


keycodes =
	enter 	: 13
	esc 	: 27


shortcodes = 
	'mon' 		: '.mon'
	'monday' 	: '.mon'
	'tue' 		: '.tue'
	'wed' 		: '.wed'
	'thur'		: '.thur'
	'fri'		: '.fri'
	'today'		: '.today'
	'td'		: '.today'
	'tomorrow'	: '.tomorrow'
	'tom'		: '.tomorrow'
	'od'		: '.onDeck'
	'bb'		: '.backburner'
	

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
	$('body').on 'keypress', (e) ->  WM.View.newTask() if e.keyCode is keycodes.enter
	$('body').on 'keyup', (e) ->  WM.View.hideSearch() if e.keyCode is keycodes.esc and searchStatus
	
	getTaskInput = -> $taskInput.val()
	setTaskInput = (val) -> $taskInput(val)		
			 



@WM.Sortable = do ->

	config = ->
		$( ".sortable" ).sortable({
			connectWith: '.sortable'
			})
		$( ".sortable" ).disableSelection()

	init = ->
		config()

	init: init


$ ->
	WM.Sortable.init()


@WM.Model = do ->

	count = 0

	countIncr = -> count++
	countDecr = -> count--
	generateTaskID = -> 
		return 'task_' + count

	loadTasks = ->
		log 'loading tasks'
		log localStorage




	getTask = (model) ->
		localStorage.getItem(model)

	setTask = (id, model, day) ->
		date = getTime()
		taskObj = 
			'task'	: model
			'date'	: date
			'day'	: day
		
		
		localStorage.setItem(id, JSON.stringify(taskObj))
		countIncr()
		log 'Local:'
		log localStorage


	getTime = ->
		new Date()


	init = ->
		today = getTime()
		day = today.getDay()
		today = '.'+weekday[day]
		loadTasks()


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
			WM.Model.setTask(id, task, day)

		hideSearch()



	showSearch = ->
		searchStatus = true
		$taskInputWrapper.show()
		$taskInput.focus()
		clickStatus = true



	hideSearch = ->
		searchStatus = false
		$taskInputWrapper.hide()
		$taskInput.val('')
		clickStatus = false



	newTask: newTask
	showSearch: showSearch
	hideSearch: hideSearch
