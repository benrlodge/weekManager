devmode = true
log = (m) -> console.log m if devmode 
delay = (ms, func) -> setTimeout func, ms



$ ->

	KEYCODES =
		enter 	: 13
		esc 	: 27


	## Shortcuts for keyboard inputs	
	DIRECTIVES = 
		'Mon'		: '.mon'
		'mon' 		: '.mon'
		'monday' 	: '.mon'
		'Tue'		: 'tue'
		'tue' 		: '.tue'
		'Wed'		: '.wed'
		'wed' 		: '.wed'
		'Thur'		: '.thur'
		'thur'		: '.thur'
		'Fri'		: '.fri'
		'fri'		: '.fri'
		'today'		: '.today'
		'td'		: '.today'
		'tomorrow'	: '.tomorrow'
		'tom'		: '.tomorrow'
		'od'		: '.onDeck'
		'onDeck'	: '.onDeck'
		'ondeck'	: '.onDeck'
		'backburner': '.backburner'
		'bb'		: '.backburner'





	class Task extends Backbone.Model

		defaults:
			target: '.backBurner'
			detail: 'empty'
			complete: false


		initialize: -> 
			@on 'remove', @destroy

		


	task = new Task




	# http://mrbool.com/backbone-js-backbone-events/27796

	class Tasks extends Backbone.Collection
		url: '/'
		model: Task
		localStorage: new Store("backbone-tasks")

		removeTask: (elements, options) ->
			@remove(elements, options)

			

	tasks = new Tasks







	

	class Week_View extends Backbone.View

		el: $ 'body'

		clickStatus: false		## For search bar keyboard controls
		lastDeletedTask: ''		## For undo


		taskInputWrapper 	: '.newTask'
		taskInput 			: '#newTaskInput'
		onDeck 				: '.onDeck'
		onDeckList 			: '.onDeck ul'
		today 				: ''


		initialize: ->
			log 'Init View'
			@collection.on('add', @render, this)
			@collection.on('remove', @render, this)
			@fetchStoredCollections()


		events: ->
			"keypress" : "searchKeyPress"
			"keyup"	: "searchKeyUp"
			"click .delete" : "deleteTask"
			"click a[data-action=undo]" : "undoTask"


		## Templates
		## =============
		template_week: Handlebars.compile( $("#template_week").html() )
		template_sidebar: Handlebars.compile( $("#template_sidebar").html() )
		



		# Move to model?
		fetchStoredCollections: ->
			that = this
			p = @collection.fetch()
			p.done ->
				_.each that.collection.models, ((item) ->
					# that.renderApp item
					return
				), that
				return




		render: () ->			
			## Filters
			## =============
			ondeck 		=  @collection.where({ target: '.onDeck' })
			backburner 	=  @collection.where({ target: '.backburner' })			
			monday 		=  @collection.where({ target: '.mon' })
			tuesday 	=  @collection.where({ target: '.tue' })
			wednesday 	=  @collection.where({ target: '.wed' })
			thursday 	=  @collection.where({ target: '.thur' })
			friday 		=  @collection.where({ target: '.fri' })

			## Collections
			## =============
			ondeckCollection 		= new Tasks(ondeck)
			backburnerCollection 	= new Tasks(backburner)
			mondayCollection  		= new Tasks(monday)
			tuesdayCollection 		= new Tasks(tuesday)
			wednesdayCollection 	= new Tasks(wednesday)
			thursdayCollection 		= new Tasks(thursday)
			fridayCollection 		= new Tasks(friday)


			$('#sidebar').html( @template_sidebar({
				onDeckTasks: 		ondeckCollection.toJSON()
				backBurnerTasks:	backburnerCollection.toJSON()
				})
			)

			
			$('.week').html( @template_week({ 
				allTasks: 	@collection.toJSON()
				monTasks: 	mondayCollection.toJSON()
				tueTasks: 	tuesdayCollection.toJSON()
				wedTasks: 	wednesdayCollection.toJSON()
				thurTasks: 	thursdayCollection.toJSON()
				friTasks: 	fridayCollection.toJSON()
				})
			)



		deleteTask: (e) ->
			_task = $(e.currentTarget)
			_taskId = $(_task).data('id')
			@undoShow(_taskId)
			@lastDeletedTask = @collection.get(_taskId)
			tasks.removeTask(_taskId)

		undoTask: (e) ->
			tasks.create(@lastDeletedTask)
			@messageClear()
			
		messageClear: ->
			$('.messages').empty()

		messageUpdate: (obj) ->
			html = "<a href='#' data-id='#{obj.id}' data-action='#{obj.action}'>#{obj.message}</a>"
			$('.messages').empty().append(html).addClass('show')

			delay 5000, => @messageClear()




		undoShow: (id) ->
			obj = {
				id: id
				message: 'Undo'
				action: 'undo'
			}
			@messageUpdate(obj)








			
			
			
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
					directive: '.backburner'
					detail: task
				}


		addTask: (obj) ->
			dir = obj.directive
			detail = obj.detail
			
			tasks.create({
				target: obj.directive
				detail: obj.detail
			})


		

	week_view = new Week_View({ collection: tasks })














# GOOD!
# http://www.levihackwith.com/using-handlebars-each-blocks-with-backbone-collections-templates/





# var friends = new Backbone.Collection([
#   {name: "Athos",      job: "Musketeer"},
#   {name: "Porthos",    job: "Musketeer"},
#   {name: "Aramis",     job: "Musketeer"},
#   {name: "d'Artagnan", job: "Guard"},
# ]);

# JSON.stringify( friends.where({job: "Musketeer"}) );

