
KEYCODES =
	enter 	: 13
	esc 	: 27

## Shortcuts for keyboard inputs	
DIRECTIVES = 
	'todo'		: '#todo'
	'doing' 	: '#doing'
	'done' 		: '#done'




## Helpers
## ====================================
cmp = (a, b) ->
	[ a, b ] = [ a.get('order'), b.get('order') ]
	return  1 if(a > b)
	return -1 if(a < b)
	return  0





## VIEW
## ====================================
class App.Week_View extends Backbone.View

	el: $ 'body'

	clickStatus: false		## For search bar keyboard controls
	lastDeletedTask: ''		## For undo

	taskInputWrapper 	: '.newTask'
	taskInput 			: '#newTaskInput'
	today 				: ''


	initialize: ->
		@collection.on('add', @render, this)
		@collection.on('remove', @render, this)


		@fetchStoredCollections()			
		@virginCheck()
		@sortablize()




	events: ->
		"keypress" : "keyPress"
		"keyup"	: "keyUp"
		"click .delete" : "deleteTask"
		"click a[data-action=undo]" : "undoTask"
		"dblclick .item-detail" : "updateTask"
		"blur .item-detail"	: "hideUpdate"





	## Templates
	## =============
	template_week: Handlebars.compile($("#template_week").html())
	# template_sidebar: Handlebars.compile($("#template_sidebar").html())
	


	render: () ->		

		## =============
		todo 	= @collection.where({target: '#todo'}).sort(cmp)
		doing 	= @collection.where({target: '#doing'}).sort(cmp)
		done 	= @collection.where({target: '#done'}).sort(cmp)

	
		## Collections... is there a better way to do this??
		## =============
		todoCollection  		= new App.Tasks(todo)
		doingCollection 		= new App.Tasks(doing)
		doneCollection 			= new App.Tasks(done)

		
		$('.weekday-container').html @template_week
			todoTasks:	 	todoCollection.toJSON()
			doingTasks: 	doingCollection.toJSON()
			doneTasks: 		doneCollection.toJSON()
		
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
		target = $(e.currentTarget)
		currentTaskText = $(e.currentTarget).text()
		@updateTaskInput(currentTaskText, target)


	updateTaskInput: (text, target) ->
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
			helper: "clone"
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
			@hideUpdate() if key.keyCode is KEYCODES.esc


		if key.keyCode is KEYCODES.esc and @searchStatus
			@newTaskInputHide()


	hideUpdate: ->
		$('.input-task-update').remove()
		return @render()



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
				directive: '#todo'
				detail: task
			}





	## Check if any tasks exist
	## ==================================
	virginCheck: ->
		if @collection.size() is 0
			tasks.create({
				target: '#todo'
				detail: 'I am an example task!'
				order: 0
			})				
			tasks.create({
				target: '#todo'
				detail: 'Double click me to edit'
				order: 1
			})				
			tasks.create({
				target: '#doing'
				detail: 'Delete me by clicking the x icon'
				order: 2
			})				
			tasks.create({
				target: '#done'
				detail: 'drag and drop me to another column'
				order: 3
			})				
			tasks.create({
				target: '#todo'
				detail: 'To create a new task, just start typing the column name followed by two dashes and then your message. For example typing: "todo--Do some karate kicks" without the quotes will create the following card:'
				order: 4
			})				
			tasks.create({
				target: '#todo'
				detail: 'Do some karate kicks'
				order: 4
			})			

week_view = new App.Week_View({ collection: window.tasks })

