devmode = true
log = (m) -> console.log m if devmode 



$ ->


	keycodes =
		enter 	: 13
		esc 	: 27


	

	class Week_View extends Backbone.View

		el: $ 'body'

		clickStatus: false

		taskInputWrapper 	: '.newTask'
		taskInput 			: '#newTaskInput'
		onDeck 				: '.onDeck'
		onDeckList 			: '.onDeck ul'
		today 				: ''



		initialize: ->
			log 'i init the View'
			@render()

		render: ->
			# template = _.template($("#tasks_template").html(), {})
			# @$el.html template


		events: ->
			"keypress"	: 	"searchKeyPress"
			"keyup"		:	"searchKeyUp"
			

		searchHide: ->
			@searchStatus = false
			$(@taskInputWrapper).hide()
			$(@taskInput).val('')
			@clickStatus = false


		searchShow: ->
			@searchStatus = true
			$(@taskInputWrapper).show()
			$(@taskInput).focus()
			@clickStatus = true


		searchKeyPress: (key) ->
			return @searchComplete() if key.keyCode is keycodes.enter
			@searchShow()


		searchKeyUp: (key) ->
			if key.keyCode is keycodes.esc and @searchStatus
				@searchHide()


		searchComplete: ->
			task = ( $(@taskInput).val()	).trim()
			directives = @searchDirectives()
			@searchHide()


		searchDirectives: ->
			log 'search directives'

			# split = task.split(':')			
			# day = split[0].toLowerCase()
			# task = split[1]
			
			# log 'dayIndex is:'
			# log dayIndex = daysArr.indexOf(day)

			# # If a day is chosen from weekday list
			# if dayIndex >= 0

			# 	addTaskDay = '.'+daysArr[dayIndex]

			# 	# Add to week list
			# 	id = WM.Model.generateTaskID()
			# 	$('.container').find(addTaskDay).find('ul').append("<li id=#{id}''>#{task}</li>")
			# 	WM.Model.setTask(id, task, day)






		addTask: (event) ->
			task_text = $("#task_input").val()
			log 'Im a gonna add me some ' + task_text
			task = new Task({ title: task_text})
			


	Week_View = new Week_View







	class Task extends Backbone.Model

		defaults:
			title: 'New task'
			complete: false

		initialize: -> 
			_.bindAll(this, 'name_update')
			this.on "change:title", (model) -> @name_update()
				
		name_update: -> 
			title = task.get("title")
			log "I updated my models title to: " + title

		complete_task: -> 
			this.set({ complete: true })
		
		incomplete_task: -> 
			this.set({ complete: false })

		set_task: (new_title) -> 
			this.set({ title: new_title  })




	task = new Task

	class Tasks extends Backbone.Collection
		model: Task

		initialize: ->
			log 'init the model'
			




	# task1 = new Task({ title: 'Eat some peanuts'})
	# task2 = new Task({ title: 'Do a dance'})
	# task3 = new Task({ title: 'Sing a song'})

	# myTasks = new Tasks([task1, task2, task3])



	# myTasks.add({ title: 'blah doop' })

	# log '-------------------------------'	

	# log myTasks


	# showAllTasks = ->
	# 	myTasks.forEach (model) ->
	# 		title = model.get("title")
	# 		$('#list').append("<li>#{title}</li>")

	# showAllTasks()


