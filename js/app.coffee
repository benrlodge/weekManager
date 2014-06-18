devmode = true
log = (m) -> console.log m if devmode 
window.clearLocal = -> localStorage.clear()
delay = (ms, func) -> setTimeout func, ms


###
	
	To Do:

	 - Move tasks to different days, draggable and typing
	 - Add "header" option



###


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


		events: ->
			"keypress" : "searchKeyPress"
			"keyup"	: "searchKeyUp"
			"click .delete" : "deleteTask"
			"click a[data-action=undo]" : "undoTask"




		## Templates
		## =============
		template_week: Handlebars.compile( $("#template_week").html() )
		template_sidebar: Handlebars.compile( $("#template_sidebar").html() )
		

		## Helpers
		## =============
		# sortAndFilterDay = (collection, day, sortby) ->
		# 	_( collection.where({ target: day }) ).sortBy (t) -> t.get(sortby)

		
		cmp = (a, b) ->
			[ a, b ] = [ a.get('order'), b.get('order') ]
			return  1 if(a > b)
			return -1 if(a < b)
			return  0
		# @collection.where(target: '#day-mon').sort(cmp)



		render: () ->		

			## Filters
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

			
			
			$('#sidebar').html @template_sidebar
				onDeckTasks: 		ondeckCollection.toJSON()
				backBurnerTasks:	backburnerCollection.toJSON()

			
			$('.week').html @template_week
				monTasks: 	mondayCollection.toJSON()
				tueTasks: 	tuesdayCollection.toJSON()
				wedTasks: 	wednesdayCollection.toJSON()
				thurTasks: 	thursdayCollection.toJSON()
				friTasks: 	fridayCollection.toJSON()
			
			@sortablize()




		## Task Actions
		## ==================================

		deleteTask: (e) ->
			_taskId = $(e.currentTarget).closest('li').data('id')

			@undoShow(_taskId)
			@lastDeletedTask = @collection.get(_taskId)
			tasks.removeTask(_taskId)

		undoTask: (e) ->
			tasks.create(@lastDeletedTask)
			@messageClear()
			

		addTask: (obj) ->
			dir = obj.directive
			detail = obj.detail
			obj.order = $(dir).find('li').length



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
			

			#check if any categories have changed - update in the modal
			

			#get the updated order of the tasks
			
			updateObj = {}

			$('.task-list').each ->

				list = $(this).find('.sortable li').each (index) ->

					_task = $(this).find('.item-detail').text()
					_id = $(this).data('id')
					_order = Number(index)
					_target = '#' + $(this).closest('.task-list').attr('id')

					log 'targt:'
					log _target

					_item = tasks.get(_id)
					_item.save
						order: _order
						target: _target



			# log 'collection updates'
			# log @collection.each (index) ->
			# 	log index.attributes




			
			
			
		## Search
		## ================================

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
			return @searchComplete() if key.keyCode is KEYCODES.enter
			@searchShow()

		searchKeyUp: (key) ->
			if key.keyCode is KEYCODES.esc and @searchStatus
				@searchHide()

		searchComplete: ->
			task = ( $(@taskInput).val()	).trim()
			task_info = @searchDirectives(task)

			@addTask(task_info) 	
			@searchHide()
			
		searchDirectives: (task) ->
			split_task = task
			task_split = task.split(":")
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
					detail: 'I am a task for Monday!'
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

