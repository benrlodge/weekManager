module.exports = function(grunt) {
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			coffee: {
				files: [
					'js/app.coffee',
					'js/models/task.coffee', 
					'js/collections/tasks.coffee', 
					'js/views/tasks.coffee', 
					'js/routers/taskRouter.coffee'],
				tasks: ['coffee:compile']
			},
			css: {
				files: 'css/main.scss',
				tasks: ['sass']
		    }
		  },

		  coffee: {
		    compile: {
		    	files: {
		    		 'js/app.js': 'js/app.coffee', 
		    		 'js/models/task.js': 'js/models/task.coffee', 
		    		 'js/collections/tasks.js': 'js/collections/tasks.coffee', 
		    		 'js/views/tasks.js': 'js/views/tasks.coffee', 
		    		 'js/routers/taskRouter.js': 'js/routers/taskRouter.coffee'
		    	}
		    }
		  },

		  sass: {
		    dist: {
		    	files: {
		    		 'css/main.css': 'css/main.scss'
		    	}
		    }
		  },

	    concat: {
	        js : {
	            src : [
	                'js/lib/backbone.js',
	                'js/lib/backbone.localStorage.js',
	                'js/lib/handlebars.js',
	                'js/lib/jquery-ui.js',
	                'js/lib/jquery.js',
	                'js/lib/underscore.js'
	            ],
	            dest : 'js/combined.js'
	        }
	    },

	    uglify : {
	        js: {
	            files: {
	                'js/combined.js' : [ 'js/combined.js' ]
	            }
	        }
	    },


    });
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', [ 'concat:js', 'uglify:js' ]);



};