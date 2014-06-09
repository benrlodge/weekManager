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

	getTaskInput = -> $taskInput.val()
	setTaskInput = (val) -> $taskInput(val)




@WM.Events = do ->

	$('body').on 'keypress', -> 
		log 'keypress'
		if !clickStatus 
			showSearch() 


	$('body').on 'keypress', (e) -> 
		if e.keyCode is KEYCODE_ENTER
			log 'Add new task'

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

	

	$('body').on 'keyup', (e) -> 
		if e.keyCode is KEYCODE_ESC and searchStatus
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
		