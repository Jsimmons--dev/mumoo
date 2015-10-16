module.exports = function(grunt) {
    grunt.initConfig({
		execute: {
			target: {
				src:['index.js']
			}
		},
        browserSync: {
            dev: {
                options: {
                    server: false,
                    background: true
                }
            }
        },
        watch: {
            html: {
                files: ['app/index.html'],
                tasks: ['bsReload:all'],
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['browserify', 'eslint', 'bsReload:js']
            },
            test: {
                files: ['test/**/*.tests.js'],
                tasks: ['karma']
            },
            options: {
                spawn: false
            },
			server: {
				files: ['index.js'],
				tasks: ['node index.js']
			}
        },
        bsReload: {
            all: {
                reload: true
            },
            js: {
                reload: 'app/built-script.js'
            }
        },
        browserify: {
            client: {
                src: 'src/main.js',
                dest: 'app/built-script.js',
                options: {
                    transform: ['babelify']
                }
            }
        },
        eslint: {
            target: ['src/**/*.js'],
            options: {
                config: 'eslint.conf.json'
            }
        },
        karma: {
			unit: {
				configFile: 'karma.conf.js',
			}
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-execute');
    //grunt.registerTask('bsInit', function() {
    //	var done = this.async();
    //	browserSync({
    //		server: "."
    //	}, function (err, bs){
    //		done();
    //	});
    //});

    //grunt.registerTask('bsReload', function() {
    //	browserSync.reload();
    //});
    grunt.registerTask('default', ['browserify', 'browserSync', 'watch','execute']);
	grunt.registerTask('test', ['karma']);
}
