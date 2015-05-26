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
            'bower_components/waypoints/lib/noframework.waypoints.js',
            'bower_components/angular-ui-bootstrap/src/position/position.js',
            'bower_components/angular-ui-bootstrap/src/dropdown/dropdown.js',
            jsDir + '/app.module.js',
            jsDir + '/**/*.js'
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
                },
                jekyllServe: {
                    command: 'jekyll serve --no-watch'
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
            replace: {
                fontello: {
                    options: {
                        patterns: [
                            {
                                match: '../font/',
                                replacement: '/assets/fontello/font/'
                            },
                            {
                                match: '[class^="icon-"]',
                                replacement: '.icon:before, [class^="icon-"]'
                            }
                        ],
                        usePrefix: false
                    },
                    files: [
                        {
                            expand: false,
                            flatten: true,
                            src: ['assets/fontello/css/fontello.css'],
                            dest: 'build/fontello.css.tmp'
                        }
                    ]
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
            },
            watch: {
                less: {
                    files: lessDir + '/**/*.less',
                    tasks: ['less:dev', 'autoprefixer:dev', 'shell:jekyllBuild']
                },
                js: {
                    files: jsDir + '/**/*.js',
                    tasks: ['concat:js', 'shell:jekyllBuild']
                },
                html: {
                    files: ['**/*.html','**/*.yml','!bower_components/**/*.*','!node_modules/**/*.*','!public/**/*.*','!build/**/*.*'],
                    tasks: ['shell:jekyllBuild']
                }
            },
            'gh-pages': {
                options: {
                    base: 'public',
                    message: 'Deploy'
                },
                src: ['**/*']
            }
        }
    );

    // Register tasks
    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dev', [
        'replace',
        'concat',
        'less:dev',
        'autoprefixer:dev'
    ]);

    grunt.registerTask('production', [
        'replace',
        'uglify',
        'less:production',
        'autoprefixer:production'
    ]);

};