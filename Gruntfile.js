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
        jsOutput_temp = 'build/main.tmp.js',
        jsOutput_production = 'build/main.min.js',
        jsInput = [
            'bower_components/waypoints/lib/noframework.waypoints.js',
            'bower_components/angular-ui-bootstrap/src/position/position.js',
            'bower_components/angular-ui-bootstrap/src/dropdown/dropdown.js',
            'bower_components/angular-local-storage/dist/angular-local-storage.js',
            jsDir + '/app.module.js',
            jsDir + '/**/*.js'
        ];

    // Source LESS files
    var lessOutput_dev = 'build/main.dev.css',
        lessOutput_production = 'build/main.min.css',
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
                build: ['build/**/*.*', '!build/.gitkeep', '!build/images/**/*.*']
            },
            concat: {
                options: {
                    separator: '\n;'
                },
                js_dev: {
                    src: jsInput,
                    dest: jsOutput_dev
                },
                js_production: {
                    src: jsInput,
                    dest: jsOutput_temp
                }
            },
            uglify: {
                production: {
                    options: {
                        mangle: false // TODO - remove once it works - mangling breaks the JS
                    },
                    files: [{
                        src: jsOutput_temp,
                        dest: jsOutput_production
                    }]
                }
            },
            removelogging: {
                production: {
                    src: [jsOutput_temp]
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
            // TODO: Can't get this to work. It crashes
            //uncss: {
            //    options: {
            //        htmlroot: 'public'
            //    },
            //    production: {
            //        files: {
            //            'public/build/main.tidy.css': ['public/**/*.html', '!public/assets/**/*.html']
            //        }
            //    }
            //},
            replace: {
                fontello: {
                    options: {
                        patterns: [
                            {
                                match: '../font/',
                                replacement: '/build/fontello/font/'
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
            cacheBust: {
                options: {
                    baseDir: 'public',
                    rename: false
                },
                production: {
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
                css: {
                    files: [lessDir + '/**/*.less', 'assets/fontello/**/*.*'],
                    tasks: ['css_dev', 'shell:jekyllBuild']
                },
                js: {
                    files: jsDir + '/**/*.js',
                    tasks: ['concat:js_dev', 'shell:jekyllBuild']
                },
                html: {
                    files: ['**/*.html', '**/*.yml', '!bower_components/**/*.*', '!node_modules/**/*.*', '!public/**/*.*'],
                    tasks: ['shell:jekyllBuild']
                },
                images: {
                    files: ['_images/**/*.{png,jpg,gif,svg}'],
                    tasks: ['optimize_images', 'shell:jekyllBuild']
                }
            },
            'gh-pages': {
                deploy: {
                    options: {
                        base: 'public',
                        message: 'Deploy'
                    },
                    src: ['**/*']
                }
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
            },
            copy: {
                fontello: {
                    expand: true,
                    cwd: 'assets/',
                    src: ['fontello/font/*.*'],
                    dest: 'build/'
                }
            }
        }
    );

    // Register tasks
    grunt.registerTask('default', ['build_dev']);

    grunt.registerTask('build_dev', [
        'clean:build',
        'optimize_images',
        'copy:fontello',
        'css_dev',
        'concat:js_dev',
        'shell:jekyllClean',
        'shell:jekyllBuild'
    ]);

    grunt.registerTask('build_production', [
        'clean:build',
        'optimize_images',
        'copy:fontello',
        'js_production',
        'css_production',
        'shell:jekyllClean',
        'shell:jekyllBuild',
        'htmlbuild:production',
        'cacheBust:production'
    ]);

    grunt.registerTask('js_production', [
        'concat:js_production',
        'removelogging',
        'uglify:production'
    ]);

    grunt.registerTask('css_production', [
        'replace:fontello',
        'less:production',
        'autoprefixer:production'
    ]);

    grunt.registerTask('css_dev', [
        'replace:fontello',
        'less:dev',
        'autoprefixer:dev'
    ]);

    grunt.registerTask('optimize_images', ['newer:imagemin:main']);

    grunt.registerTask('serve', [
        'shell:jekyllServe'
    ]);

    grunt.registerTask('startup', [
        'build_dev',
        'serve',
        'watch'
    ]);

    grunt.registerTask('deploy', [
        'build_production',
        'gh-pages'
    ]);

};