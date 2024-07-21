// BeGroup Gruntfile
module.exports = function (grunt) {
  // jshint ignore:line
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      less: {
        // Compiles less files upon saving
        files: ["build/less/*.less"],
        tasks: [
          "less:development",
          "less:production",
          "replace",
          "notify:less",
        ],
      },
      js: {
        // Compile js files upon saving
        files: ["build/js/*.js"],
        tasks: ["js", "notify:js"],
      },
      pug: {
        // Compile js files upon saving
        files: ["build/pages/*.pug", "build/index.pug"],
        tasks: ["pug:debug", "pug:release", "notify:pug"],
      },
      html: {
        files: ["build/pages/*.html", "build/index.html"],
      },
      options: {
        // reload page
        livereload: true,
      },
    },
    // Notify end of tasks
    notify: {
      less: {
        options: {
          title: "Less",
          message: "LESS finished running",
        },
      },
      js: {
        options: {
          title: "JS",
          message: "JS bundler finished running",
        },
      },
      pug: {
        options: {
          title: "Pug",
          message: "PUG bundler finished running",
        },
      },
    },
    // 'less'-task configuration
    less: {
      // Development not compressed
      development: {
        files: {
          // compilation.css  :  source.less
          "dist/css/style.css": "build/less/style.less",
          "dist/css/responsive.css": "build/less/responsive.less",
          "dist/css/courseDetail.css": "build/less/courseDetail.less",
        },
      },
      // Production compressed version
      production: {
        options: {
          compress: true,
        },
        files: {
          // compilation.css  :  source.less
          "dist/css/style.min.css": "build/less/style.less",
          "dist/css/responsive.min.css": "build/less/responsive.less",
          "dist/css/courseDetail.css": "build/less/courseDetail.less",
        },
      },
    },
    //pug
    pug: {
      debug: {
        options: {
          data: {
            debug: true,
            timestamp: "<%= new Date().getTime() %>",
          },
          pretty: true,
        },
        files: {
          "dist/index.html": "build/index.pug",
          "dist/pages/courseDetail.html": "build/pages/courseDetail.pug",
        },
      },
      release: {
        options: {
          data: {
            debug: false,
          },
          pretty: true,
        },
        files: {
          "index.html": "index.pug",
        },
      },
    },
    // Uglify task info. Compress the js files.
    uglify: {
      options: {
        mangle: true,
        preserveComments: "some",
      },
      production: {
        files: {},
      },
    },

    // Concatenate JS Files
    concat: {
      options: {
        separator: "\n\n",
        banner: "/*! BeGroup app.js\n",
      },
      dist: {
        src: [],
        dest: "dist/script.js",
      },
    },

    // Replace image paths in BeGroup without plugins
    replace: {
      withoutPlugins: {
        src: ["dist/css/alt/BeGroup-without-plugins.css"],
        dest: "dist/css/alt/BeGroup-without-plugins.css",
        replacements: [
          {
            from: "../img",
            to: "../../img",
          },
        ],
      },
      withoutPluginsMin: {
        src: ["dist/css/alt/BeGroup-without-plugins.min.css"],
        dest: "dist/css/alt/BeGroup-without-plugins.min.css",
        replacements: [
          {
            from: "../img",
            to: "../../img",
          },
        ],
      },
    },

    // Optimize images
    image: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: "build/img/",
            src: ["**/*.{png,jpg,gif,svg,jpeg}"],
            dest: "dist/img/",
          },
        ],
      },
    },

    // Validate JS code
    jshint: {
      options: {
        jshintrc: "build/js/.jshintrc",
      },
      grunt: {
        options: {
          jshintrc: "build/grunt/.jshintrc",
        },
        src: "Gruntfile.js",
      },
      core: {
        src: "build/js/*.js",
      },
    },

    jscs: {
      options: {
        config: "build/js/.jscsrc",
      },
      core: {
        src: "<%= jshint.core.src %>",
      },
    },

    // Validate CSS files
    csslint: {
      options: {
        csslintrc: "build/less/.csslintrc",
      },
      dist: ["dist/css/BeGroup.css"],
    },

    // Validate Bootstrap HTML
    bootlint: {
      options: {
        relaxerror: ["W005"],
      },
      files: ["pages/*.html", "*.html"],
    },

    // Validate Pug HTML
    puglint: {
      options: {
        config: "pages/.pug-lintrc",
      },
      files: ["build/pages/*.pug", "*.pug"],
    },

    // Delete images in build directory
    // After compressing the images in the build/img dir, there is no need
    // for them
    clean: {
      build: ["build/img/*"],
    },
  });

  // Load all grunt tasks

  // LESS Compiler
  grunt.loadNpmTasks("grunt-contrib-less");
  // Watch File Changes
  grunt.loadNpmTasks("grunt-contrib-watch");
  // Compress JS Files
  grunt.loadNpmTasks("grunt-contrib-uglify");
  // Include Files Within HTML
  grunt.loadNpmTasks("grunt-includes");
  // Optimize images
  grunt.loadNpmTasks("grunt-image");
  // Validate JS code
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  // Delete not needed files
  grunt.loadNpmTasks("grunt-contrib-clean");
  // Lint CSS
  grunt.loadNpmTasks("grunt-contrib-csslint");
  // Lint Bootstrap
  grunt.loadNpmTasks("grunt-bootlint");
  //Lint PUG
  grunt.loadNpmTasks("grunt-puglint");
  // Concatenate JS files
  grunt.loadNpmTasks("grunt-contrib-concat");
  // Notify
  grunt.loadNpmTasks("grunt-notify");
  // Replace
  grunt.loadNpmTasks("grunt-text-replace");
  //Pug
  grunt.loadNpmTasks("grunt-contrib-pug");

  // Linting task
  grunt.registerTask("lint", ["jshint", "csslint", "bootlint"]);
  // JS task
  grunt.registerTask("js", ["concat", "uglify"]);
  // CSS Task
  grunt.registerTask("css", ["less:development", "less:production", "replace"]);

  // The default task (running 'grunt' in console) is 'watch'
  grunt.registerTask("default", ["watch"]);
};
