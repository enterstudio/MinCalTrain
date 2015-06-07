module.exports = function(grunt) {

  grunt.registerTask('compliment', 'Stay motivated!', function() {
    var compliments = grunt.config('compliment.compliments');
    var index = Math.floor(Math.random() * compliments.length);

    grunt.log.writeln(compliments[index]);
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compliment: {
      compliments: [
        "Wow peter great work!",
        "Such a professional dev environment",
        "Can't stop the TRAIN",
        "git raging"
      ]
    },
    jasmine_node: {
      specs: './src/js/__tests__/*.spec.js',
      forceExit: true,
      verbose: true
    },
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.registerTask('test', ['jasmine_node', 'compliment']);
};
