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


daysArr = ['monday','tuesday','wednesday','thursday','friday','today','tomorrow', 'od','bb']




@WM.Events = do ->

	$('body').on 'keypress', ->  WM.View.showSearch()  if !clickStatus 
	$('body').on 'keypress', (e) ->  WM.View.newTask() if e.keyCode is KEYCODE_ENTER
	$('body').on 'keyup', (e) ->  WM.View.hideSearch() if e.keyCode is KEYCODE_ESC and searchStatus
	
	getTaskInput = -> $taskInput.val()
	setTaskInput = (val) -> $taskInput(val)		
			 





@WM.View = do ->

	newTask = ->
		task = $taskInput.val()
		split = task.split(':')			

		day = split[0].toLowerCase()
		task = split[1]
		
		dayIndex = daysArr.indexOf(day)

		# If a day is chosen from weekday list
		if dayIndex >= 0
			addTaskDay = '.'+daysArr[dayIndex]
		
			# Add to week list
			$('.container').find(addTaskDay).find('ul').append("<li>#{task}</li>")


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
