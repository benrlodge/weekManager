

## COLLECTIONS
## ====================================
class App.Tasks extends Backbone.Collection
	url: '/'
	model: App.Task
	localStorage: new Store("backbone-tasks")

	removeTask: (elements, options) ->
		@remove(elements, options)

window.tasks = new App.Tasks


