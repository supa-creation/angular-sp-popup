module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            src: 'src',
            dest: 'dist'
        },
        copy: {
            main: {
                files: [
                    {src: '<%= dirs.src %>/js/<%= pkg.name %>.js', dest: '<%= dirs.dest %>/<%= pkg.name %>.js'},
                ]
            }
        },
        cssmin: {
            combine: {
                files: {
                    '<%= dirs.dest %>/<%= pkg.name %>.min.css': ['<%= dirs.dest %>/<%= pkg.name %>.css']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/js/**/*.js']
        },
        sass: {
            options: {
                compass: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './src/scss',
                    src: ['*.scss'],
                    dest: './dist',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            dist: {
                src: '<%= dirs.dest %>/<%= pkg.name %>.js',
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            dev: {
                files: ['<%= dirs.src %>/**'],
                tasks: ['build'],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['jshint', 'copy', 'cssmin', 'sass', 'uglify']);

    grunt.registerTask('default', ['jshint', 'copy', 'cssmin', 'sass', 'uglify']);
};