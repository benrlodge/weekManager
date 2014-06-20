module.exports = function(grunt) {
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

		 watch: {
		    coffee: {
		      files: 'js/app.coffee',
		      tasks: ['coffee:compile']
		    },
		    css: {
		    	files: 'css/main.sass',
		    	tasks: ['sass']
		    }
		  },

		  coffee: {
		    compile: {
		    	files: {
		    		 'js/app.js': 'js/app.coffee', 
		    		 // 'path/to/another.js': ['path/to/sources/*.coffee', 'path/to/more/*.coffee'] // compile and concat into single file
		    	}
		    }
		  },

		  sass: {
		    dist: {
		    	files: {
		    		 'css/main.css': 'css/main.sass'
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