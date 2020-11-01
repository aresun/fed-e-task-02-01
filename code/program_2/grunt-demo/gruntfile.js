const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");

module.exports = (grunt) => {
  grunt.initConfig({
    // $ yarn add grunt-sass sass --dev
    // load grunt sass
    // write config below
    // $ yarn grunt sass // to execute task
    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      main: {
        files: {
          "dist/css/main.css": "src/scss/main.scss",
        },
      },
    },

    // $ yarn add grunt-babel @babel/core @bable/preset-env --dev
    // $ yarn grunt babel
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      main: {
        files: {
          "dist/js/app.js": "src/js/app.js",
        },
      },
    },

    // $ yarn add grunt-contrib-watch --dev
    // $ yarn grunt watch
    watch: {
      js: {
        files: ["src/js/*.js"],
        tasks: ["babel"],
      },
      css: {
        files: ["src/scss/*.scss"],
        tasks: ["sass"],
      },
    },
  });

  // grunt.loadNpmTasks('grunt-sass')

  // $ yarn add load-grunt-tasks --dev
  loadGruntTasks(grunt); // 自动加载所有的 grunt 插件中的任务

  // $ yarn grunt
  grunt.registerTask("default", ["sass", "babel", "watch"]);
};
