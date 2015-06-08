module.exports = function (grunt) {

    // Load all tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time
    require('time-grunt')(grunt);

    // Paths
    var jsDir = '_js';
    var lessDir = '_less';

    // Source JS files
    var jsOutput_dev = 'public/build/main.dev.js',
        jsOutput_production = 'public/build/main.min.js',
        jsInput = [
            'bower_components/waypoints/lib/noframework.waypoints.js',
            'bower_components/angular-ui-bootstrap/src/position/position.js',
            'bower_components/angular-ui-bootstrap/src/dropdown/dropdown.js',
            'bower_components/angular-local-storage/dist/angular-local-storage.js',
            jsDir + '/app.module.js',
            jsDir + '/**/*.js'
        ];

    // Source LESS files
    var lessOutput_dev = 'public/build/main.dev.css',
        lessOutput_production = 'public/build/main.min.css',
        lessInput = [
            lessDir + '/main.less'
        ];

    var mozjpeg = require('imagemin-mozjpeg');

    // Project configuration.
    grunt.initConfig(
        {
            shell: {
                jekyllClean: {
                    command: 'jekyll clean'
                },
                jekyllBuild: {
                    command: 'jekyll build'
                },
                jekyllServe: {
                    command: 'jekyll serve --no-watch'
                }
            },
            clean: {
                production: ['build/**/*.*', '!build/.gitkeep', '!build/images/**/*.*']
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
            removelogging: {
                production: {
                    src: ['public/build/main.min.js']
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
            uncss: {
                options: {
                    htmlroot: 'public',
                    report: 'min'
                },
                production: {
                    files: {
                        'public/build/main.tidy.css': ['public/**/*.html', '!public/assets/**/*.html']
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
                            dest: 'public/build/fontello.css.tmp'
                        }
                    ]
                }
            },
            htmlbuild: {
                production: {
                    src: 'public/**/*.html',
                    dest: 'public/',
                    options: {
                        replace: true,
                        prefix: '/',
                        scripts: {
                            main: [
                                'public/build/main.min.js'
                            ]
                        },
                        styles: {
                            main: [
                                'public/build/main.min.css'
                            ]
                        }
                    }
                }
            },
            cacheBust:    {
                options: {
                    baseDir: 'public',
                    rename:  false
                },
                production:     {
                    files: [
                        {
                            src: ['public/**/*.html']
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
                    tasks: ['less:dev', 'autoprefixer:dev']
                },
                js: {
                    files: jsDir + '/**/*.js',
                    tasks: ['concat:js']
                },
                html: {
                    files: ['**/*.html', '**/*.yml', '!bower_components/**/*.*', '!node_modules/**/*.*', '!public/**/*.*'],
                    tasks: ['shell:jekyllBuild']
                },
                fontello: {
                    files: ['assets/fontello/**/*.*'],
                    tasks: ['replace:fontello', 'less:dev', 'autoprefixer:dev']
                },
                images: {
                    files: ['_images/**/*.{png,jpg,gif,svg}'],
                    tasks: ['images', 'shell:jekyllBuild']
                }
            },
            'gh-pages': {
                options: {
                    base: 'public',
                    message: 'Deploy'
                },
                src: ['**/*']
            },
            imagemin: {
                main: {
                    options: {
                        optimizationLevel: 3,
                        svgoPlugins: [{removeViewBox: false}],
                        use: [mozjpeg()]
                    },
                    files: [
                        {
                            expand: true,
                            cwd: '_images/',
                            src: ['**/*.{png,jpg,gif,svg}'],
                            dest: 'build/images/'
                        }
                    ]
                }
            }
        }
    );

    // Register tasks
    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dev', [
        'shell:jekyllClean',
        'shell:jekyllBuild',
        'replace',
        'images',
        'less:dev',
        'autoprefixer:dev',
        'concat:js'
    ]);

    grunt.registerTask('serve', [
        'shell:jekyllServe'
    ]);

    grunt.registerTask('images', ['newer:imagemin:main']);

    grunt.registerTask('production', [
        'clean:production',
        'shell:jekyllClean',
        'shell:jekyllBuild',
        'images',
        'replace',
        'less:production',
        'autoprefixer:production',
        'uglify:production',
        'removelogging',
        'htmlbuild:production',
        'cacheBust:production'
    ]);

    grunt.registerTask('deploy', [
        'production',
        'gh-pages'
    ]);

};