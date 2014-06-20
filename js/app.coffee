devmode = true
log = (m) -> console.log m if devmode 
window.clearLocal = -> localStorage.clear()
delay = (ms, func) -> setTimeout func, ms


###	
	To Do:
	
	 -- CLEAR TIMEOUT WHEN MULTIPLE DELTED BEFORE 6000

	 - Refactor templates using handlebars block helpers
	 - Move templates out
	 - Add update task name
	 - Add "header" option
	 - Find how to use jade with coffeescript

###




## VARS
## ============================================

$weekDayContainer = $('.weekday-container')
$sidebarContainer = $('.other-tasks-container')



currentTaskText = ''

$ ->

	KEYCODES =
		enter 	: 13
		esc 	: 27


	## Shortcuts for keyboard inputs	
	DIRECTIVES = 
		'Mon'		: '#day-mon'
		'mon' 		: '#day-mon'
		'monday' 	: '#day-mon'
		'Tue'		: '#day-tue'
		'tue' 		: '#day-tue'
		'Wed'		: '#day-wed'
		'wed' 		: '#day-wed'
		'Thur'		: '#day-thur'
		'thur'		: '#day-thur'
		'Fri'		: '#day-fri'
		'fri'		: '#day-fri'
		'od'		: '#onDeck'
		'onDeck'	: '#onDeck'
		'ondeck'	: '#onDeck'
		'backburner': '#backburner'
		'bb'		: '#backburner'
		# 'today'		: '#day-today'	
		# 'td'		: '#day-today'
		# 'now'		: '#day-today'
		# 'tomorrow'	: '#day-tomorrow'
		# 'tom'		: '#day-tomorrow'


	DAYS = 
		1 : '#day-mon'
		2 : '#day-tue'
		3 : '#day-wed'
		4 : '#day-thur'
		5 : '#day-fri'




	## Helpers
	## ====================================
	cmp = (a, b) ->
		[ a, b ] = [ a.get('order'), b.get('order') ]
		return  1 if(a > b)
		return -1 if(a < b)
		return  0



	## MODELS 
	## ====================================
	class Task extends Backbone.Model

		defaults:
			target: '#backBurner'
			detail: 'empty'
			order: ''
			complete: false

		initialize: -> 
			@on 'remove', @destroy



	# http://mrbool.com/backbone-js-backbone-events/27796





	## COLLECTIONS
	## ====================================
	class Tasks extends Backbone.Collection
		url: '/'
		model: Task
		localStorage: new Store("backbone-tasks")

		removeTask: (elements, options) ->
			@remove(elements, options)

	tasks = new Tasks




	## VIEW
	## ====================================
	class Week_View extends Backbone.View

		el: $ 'body'

		clickStatus: false		## For search bar keyboard controls
		lastDeletedTask: ''		## For undo

		taskInputWrapper 	: '.newTask'
		taskInput 			: '#newTaskInput'
		onDeck 				: '#onDeck'
		onDeckList 			: '#onDeck ul'
		today 				: ''


		initialize: ->
			@collection.on('add', @render, this)
			@collection.on('remove', @render, this)

			@fetchStoredCollections()			
			@virginCheck()
			@sortablize()

			# log 'days:'
			# date = new Date()
			# today = date.getDay()



			# log '----'


			# dayDiv = ''

			# for k, v of DAYS

			# 	if Number(k) is today
			# 		dayDiv = v


			# $('.week > .day').each ->
			# 	log 'this: '
			# 	log this
		





		events: ->
			"keypress" : "keyPress"
			"keyup"	: "keyUp"
			"click .delete" : "deleteTask"
			"click a[data-action=undo]" : "undoTask"
			"dblclick .item-detail" : "updateTask"




		## Templates
		## =============
		template_week: Handlebars.compile( $("#template_week").html() )
		template_sidebar: Handlebars.compile( $("#template_sidebar").html() )
		


		render: () ->		

			## Filters...better way to do this??
			## =============
			ondeck 		= @collection.where({target: '#onDeck'}).sort(cmp)
			backburner 	= @collection.where({target: '#backburner'}).sort(cmp)
			monday 		= @collection.where({target: '#day-mon'}).sort(cmp)
			tuesday 	= @collection.where({target: '#day-tue'}).sort(cmp)
			wednesday 	= @collection.where({target: '#day-wed'}).sort(cmp)
			thursday 	= @collection.where({target: '#day-thur'}).sort(cmp)
			friday 		= @collection.where({target: '#day-fri'}).sort(cmp)


		
			## Collections
			## =============
			ondeckCollection 		= new Tasks(ondeck)
			backburnerCollection 	= new Tasks(backburner)
			mondayCollection  		= new Tasks(monday)
			tuesdayCollection 		= new Tasks(tuesday)
			wednesdayCollection 	= new Tasks(wednesday)
			thursdayCollection 		= new Tasks(thursday)
			fridayCollection 		= new Tasks(friday)

			
			$sidebarContainer.html @template_sidebar
				onDeckTasks: 		ondeckCollection.toJSON()
				backBurnerTasks:	backburnerCollection.toJSON()
			
			$weekDayContainer.html @template_week
				monTasks: 	mondayCollection.toJSON()
				tueTasks: 	tuesdayCollection.toJSON()
				wedTasks: 	wednesdayCollection.toJSON()
				thurTasks: 	thursdayCollection.toJSON()
				friTasks: 	fridayCollection.toJSON()
			
			@sortablize()




		## Task Actions
		## ==================================

		getTaskId = (task) ->
			$(task.currentTarget).closest('li').data('id')

		deleteTask: (e) ->
			_taskId = getTaskId(e)

			@undoShow(_taskId)
			@lastDeletedTask = @collection.get(_taskId)
			tasks.removeTask(_taskId)

		undoTask: (e) ->
			tasks.create(@lastDeletedTask)
			@messageClear()

		updateTask: (e) ->
			log 'update'

			# id = getTaskId(e)
			target = $(e.currentTarget)
			currentTaskText = $(e.currentTarget).text()


			@updateTaskInput(currentTaskText, target)


		updateTaskInput: (text, target) ->
			log 'tearget: '
			log $(target)

			inputHTML = "<input class='input-task-update empty-input' type='text' value='#{text}'>"
			$(target).empty().append(inputHTML)
			
			

			# $inputTaskUpdate = $('.input-task-update')  ## WHY CAN'T I MAKE THIS GLOBAL ??

			$('.input-task-update').focus()



		

		addTask: (obj) ->
			dir = obj.directive
			detail = obj.detail
			obj.order = $(dir).find('li').length ## BETTER TO LOOK THIS UP DIRECTLY IN COLLECTION?? THIS SEEMS FASTER

			newTask = tasks.create
				target: obj.directive
				detail: obj.detail
				order: obj.order
			,
				success: (response) =>
					@render()  ## Better way of doing? Need for getting id after save
		


		## Move to model?
		## ===================================
		fetchStoredCollections: ->
			
			p = @collection.fetch()
			p.done =>
				_.each @collection.models, ((item) ->
					# that.renderApp item
					return
				), @
				return




		## Messages
		## ====================================

		messageClear: ->
			$('.messages').empty()

		messageUpdate: (obj) ->
			html = "<a href='#' data-id='#{obj.id}' data-action='#{obj.action}'>#{obj.message}</a>"
			$('.messages').empty().append(html).addClass('show')
			delay 6000, => @messageClear() 

		undoShow: (id) ->
			obj = {
				id: id
				message: 'Undo'
				action: 'undo'
			}
			@messageUpdate(obj)





		## Drag and Drop
		## ================================
		sortablize: ->
			$('.sortable').sortable
				connectWith: ".sortable"
				refreshPositions: true
				update: =>
					@updateOrder()
    


		updateOrder: ->
			
			updateObj = {}

			$('.task-list').each ->

				list = $(this).find('.sortable li').each (index) ->

					_task = $(this).find('.item-detail').text()
					_id = $(this).data('id')
					_order = Number(index)
					_target = '#' + $(this).closest('.task-list').attr('id')

					_item = tasks.get(_id)
					_item.save
						order: _order
						target: _target



			# log 'collection updates'
			# log @collection.each (index) ->
			# 	log index.attributes




			
			
			
		## Tasks
		## ================================

		inputTaskInputVal = ->
			$('.input-task-update').val()

		updateTaskActive = ->
			$('.input-task-update').length

		newTaskInputHide: ->
			@searchStatus = false
			$(@taskInputWrapper).hide()
			$(@taskInput).val('')
			@clickStatus = false

		newTaskInputShow: ->
			@searchStatus = true
			$(@taskInputWrapper).show()
			$(@taskInput).focus()
			@clickStatus = true

		keyPress: (key) ->
			
			if updateTaskActive()
				if key.keyCode is KEYCODES.enter
					#updateDetail = @inputTaskInputVal()  ## WHY DOESN'T THIS WORK??
					updateDetail = $('.input-task-update').val()
					_id = $('.input-task-update').closest('li').data('id')
					_item = tasks.get(_id)
					_item.save
						detail: updateDetail
					return @render()
				return

			if key.keyCode is KEYCODES.enter
				return @keyComplete() 

			@newTaskInputShow()



		keyUp: (key) ->

			if updateTaskActive()
				if key.keyCode is KEYCODES.esc
					$('.input-task-update').remove()
					return @render()

			if key.keyCode is KEYCODES.esc and @searchStatus
				@newTaskInputHide()


		keyComplete: ->
			task = ( $(@taskInput).val() ).trim()
			task_info = @searchDirectives(task)
			@addTask(task_info) 	
			@newTaskInputHide()

			
		searchDirectives: (task) ->
			split_task = task
			task_split = task.split("--")
			task_directive = task_split[0]
			task_detail = task_split[1]
			
			_count = 0

			for k, v of DIRECTIVES
				if k is task_directive
					_count++
					return{
						directive: v
						detail: task_detail
					}

			if _count is 0
				return{
					directive: '#backburner'
					detail: task
				}



		## Check if any tasks exist
		## ==================================
		virginCheck: ->
			if @collection.size() is 0
				tasks.create({
					target: '#day-mon'
					detail: 'I am a task for Monday! Imagine that!'
					order: 0
				})				
				@render()
			else
				return


		

	week_view = new Week_View({ collection: tasks })





	## ROUTERS 
	## ====================================
	class Router extends Backbone.Router
		initialize: ->



	router = new Router





# Sortabe order
# http://jsfiddle.net/7X4PX/4/

