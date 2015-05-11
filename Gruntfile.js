module.exports = function (grunt) {

    // Load all tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time
    require('time-grunt')(grunt);

    // Source JS files
    var jsOutput_dev = 'build/main.dev.js',
        jsOutput_production = 'build/main.min.js',
        jsInput = [
            '_js/main.js'
        ];

    // Source LESS files
    var lessOutput_dev = 'build/main.dev.css',
        lessOutput_production = 'build/main.min.css',
        lessInput = ['_less/main.less'];

    // Project configuration.
    grunt.initConfig(
        {
            shell: {
                jekyllBuild: {
                    command: 'jekyll build'
                }
            },
            concat: {
                options: {
                    separator: '\n;'
                },
                main: {
                    src: jsInput,
                    dest: jsOutput_dev
                }
            },
            uglify: {
                main: {
                    files: [{
                        src: jsInput,
                        dest: jsOutput_production
                    }]
                }
            },
            less: {
                dev: {
                    files: [{
                        src: lessInput,
                        dest: lessOutput_dev
                    }],
                    options: {
                        compress: false
                    }
                },
                production: {
                    files: [{
                        src: lessInput,
                        dest: lessOutput_production
                    }],
                    options: {
                        compress: true
                    }
                }
            }
        }
    );

    // Register tasks
    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dev', [

    ]);

    grunt.registerTask('production', [

    ]);

};