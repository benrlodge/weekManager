

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


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

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', [ 'concat:js', 'uglify:js' ]);



};