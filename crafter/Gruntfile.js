module.exports = function(grunt){

	var templateFiles = {}; 
	grunt.file.expand(['src/pages/**/*.html', 'src/templates/**/*.html']).forEach(function (src) {
		dest = src.replace(/^src\/app/,'temp');
		templateFiles[dest] = src;
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint:{
			all: ['src/js/**/*.js']
		},
		watch:{
			js:{
				files:['src/js/**/*.js'],
				tasks:['ngAnnotate','concat','uglify']
			},
			css:{
				files:['src/css/**/*.scss'],
				tasks:['sass']
			},
			html:{
				files:['src/**/*.html'], 
				tasks:['template','ngtemplates','ngAnnotate','concat','uglify']
			}
		},
		sass: {                             
	    	dist: {       
      			options: {
        			style: 'compressed',
        			noCache: true,
        			compass: true,
        			sourcemap: 'none'
      			},
      			files: {                   
        			'dist/css/app.css': 'src/css/app.scss'
      			}
    		}
  		},		
		copy: {
  			app: {
    			files: [			
      				{
      					expand: true, 
      					cwd: 'src/img/',
      					src: ['**'], 
      					dest: 'dist/img'
      				},
      				{
      					expand: true, 
      					cwd: 'src/static/',
      					src: ['**'], 
      					dest: 'dist/'
      				},
      				{
      					expand: true, 
      					cwd: 'temp/pages/',
      					src: ['**'], 
      					dest: 'dist/'
      				}    				     				
      			]
  			}, 
  			js: {
  				files: [
  					{
				        src: 	'temp/js/all.concat.js',
				        dest: 	'dist/js/app.js'   						
  					}
  				]
  			}
		},
		 template: {
            'process-html-template': {
                options: {
                	data: {
                		pkg: grunt.file.readJSON('package.json')
                	},
                    delimiters: 'handlebars-like-delimiters'
                },
                files: templateFiles
            }
        },
		ngtemplates:{
			app:{
				cwd: 	'temp/templates/',
				src: 	'**/*.html',
				dest: 	'temp/js/app.templates.js'
			}
		},
		ngAnnotate:{
			options:{
				singleQuotes: true
			},
			app:{
				files:[
					{
						src: 	'src/js/**/*.js',
						dest: 	'temp/js/app.main.js'
					}
				]
			}
		},
		concat: {
		    app: { 
		        src: 	'temp/js/*.js',
		        dest: 	'temp/js/app.concat.js'
		    },
	      	vendor: {
	      		src: [
			        "bower_components/angular/angular.js",
			        "bower_components/angular-resource/angular-resource.js",
			        "bower_components/angular-route/angular-route.js",
			        "bower_components/angular-animate/angular-animate.js",
			        "bower_components/angular-websocket/angular-websocket.js",
			        "bower_components/angular-clipboard/angular-clipboard.js",
			        "bower_components/underscore/underscore.js",
			        "bower_components/jquery/dist/jquery.js",
			        "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js",
			        "bower_components/js-xlsx/dist/xlsx.full.min.js",
			        "bower_components/toastr/toastr.js"
	      		],
	      		dest: 'temp/js/vendor.concat.js'
	      	},
	      	all: {
	      		src: [
	      			'temp/js/vendor.concat.js', 
	      			'temp/js/app.concat.js'
	      		],
	      		dest: 'temp/js/all.concat.js'
	      	}
		},	
		uglify: {
		    js: { 
		        src: 	'temp/js/all.concat.js',
		        dest: 	'dist/js/app.js' 
		    }
		},
		clean: {
			temp: ['temp'],
		  	build: ['temp', 'build'],
		}					
	});

	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('build:dist', [
		'clean:build',

		'jshint',

		'template',
		'ngtemplates',

		'sass',

		'ngAnnotate',
		'concat',
		'uglify',

		'copy:app',
		'clean:temp'
	]);
	grunt.registerTask('build:dev', [
		'clean:build',

		'jshint',

		'template',
		'ngtemplates',

		'sass',

		'ngAnnotate',
		'concat',

		'copy',
		'clean:temp'
	]);

}
