devmode = true
log = (m) -> console.log m if devmode 



$ ->

	KEYCODES =
		enter 	: 13
		esc 	: 27

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
			_.bindAll(this, 'complete_task')
			@on 'remove', @destroy
			
				
		name_update: -> 
			title = task.get("title")

		complete_task: -> 
			this.set({ complete: true })
		
		# incomplete_task: -> 
		# 	this.set({ complete: false })

		# set_task: (new_title) -> 
		# 	this.set({ title: new_title  })

		# get_task: ->
		# 	this.get()




	task = new Task




	# http://mrbool.com/backbone-js-backbone-events/27796

	class Tasks extends Backbone.Collection
		url: '/'
		model: Task
		localStorage: new Store("backbone-tasks")

		initialize: ->
			@on('add', @newTask, this)
			@on('change', @change, this)



		removeTask: (elements, options) ->
			@remove(elements, options)

	




		newTask: (model) ->
			log 'new task model: ' + model.get('detail')

		change: (model) ->
			log 'model has been changed'
			

	tasks = new Tasks








	

	class Week_View extends Backbone.View

		el: $ 'body'

		clickStatus: false

		taskInputWrapper 	: '.newTask'
		taskInput 			: '#newTaskInput'
		onDeck 				: '.onDeck'
		onDeckList 			: '.onDeck ul'
		today 				: ''


		## Templates
		## =============
		template_week: Handlebars.compile( $("#template_week").html() )
		template_sidebar: Handlebars.compile( $("#template_sidebar").html() )
		

		initialize: ->
			log 'Init View'
			@collection.on('add', @render, this)
			@collection.on('remove', @render, this)
			@getLocalCollections()




		getLocalCollections: ->
			that = this
			p = undefined
			console.log "fetching..."
			p = @collection.fetch()
			p.done ->
				console.log "fetched!"
				_.each that.collection.models, ((item) ->
					# that.renderApp item
					log item
					return
				), that
				return



		render: () ->			

			## Filters
			## =============
			ondeck =  @collection.where({ target: '.onDeck' })
			backburner =  @collection.where({ target: '.backburner' })			
			monday =  @collection.where({ target: '.mon' })
			tuesday =  @collection.where({ target: '.tue' })
			wednesday =  @collection.where({ target: '.wed' })
			thursday =  @collection.where({ target: '.thur' })
			friday =  @collection.where({ target: '.fri' })

			## Collections
			## =============
			ondeckCollection = new Tasks(ondeck)
			backburnerCollection = new Tasks(backburner)
			mondayCollection  = new Tasks(monday)
			tuesdayCollection = new Tasks(tuesday)
			wednesdayCollection = new Tasks(wednesday)
			thursdayCollection = new Tasks(thursday)
			fridayCollection = new Tasks(friday)


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




		events: ->
			"keypress"			: 	"searchKeyPress"
			"keyup"				:	"searchKeyUp"
			"click .delete" 	:	"deleteTask"




		deleteTask: (e) ->
			log '-----------------------'
			log 'delete this task'
			_task = $(e.currentTarget)
			_taskId = $(_task).data('id')

			log @collection.get(_taskId)
			
			log 'full collection: '
			log @collection
			tasks.removeTask(_taskId)
			log 'new collection: '
			log @collection

			
			
			


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





# GOOD!
# http://www.levihackwith.com/using-handlebars-each-blocks-with-backbone-collections-templates/





# var friends = new Backbone.Collection([
#   {name: "Athos",      job: "Musketeer"},
#   {name: "Porthos",    job: "Musketeer"},
#   {name: "Aramis",     job: "Musketeer"},
#   {name: "d'Artagnan", job: "Guard"},
# ]);

# JSON.stringify( friends.where({job: "Musketeer"}) );

