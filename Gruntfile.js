module.exports = function (grunt) {

    // Load all tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig(
        {
            shell: {
                jekyllBuild: {
                    command: 'jekyll build'
                }
            }
        }
    );

    // Register tasks
    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dev', [

    ]);

    grunt.registerTask('dist', [

    ]);

};