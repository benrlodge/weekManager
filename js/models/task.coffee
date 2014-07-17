
## MODELS 
## ====================================
class App.Task extends Backbone.Model

	initialize: -> 
		@on 'remove', @destroy