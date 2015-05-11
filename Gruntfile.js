module.exports = function (grunt) {

    // Load all tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time
    require('time-grunt')(grunt);

    // Paths
    var jsDir = '_js';
    var lessDir = '_less';

    // Source JS files
    var jsOutput_dev = 'build/main.dev.js',
        jsOutput_production = 'build/main.min.js',
        jsInput = [
            jsDir + '/main.js'
        ];

    // Source LESS files
    var lessOutput_dev = 'build/main.dev.css',
        lessOutput_production = 'build/main.min.css',
        lessInput = [
            lessDir + '/main.less'
        ];

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
                js: {
                    src: jsInput,
                    dest: jsOutput_dev
                }
            },
            uglify: {
                production: {
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
            },
            autoprefixer: {
                options: {
                    browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
                },
                dev: {
                    src: lessOutput_dev
                },
                production: {
                    src: lessOutput_production
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