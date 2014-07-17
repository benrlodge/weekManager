
## MODELS 
## ====================================
class App.Task extends Backbone.Model

	defaults:
		target: '#backBurner'
		detail: 'empty'
		order: ''
		complete: false

	initialize: -> 
		@on 'remove', @destroy
