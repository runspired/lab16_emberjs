// Karma configuration
// Generated on Tue Sep 24 2013 14:33:42 GMT-0700 (PDT)
(function() {
	"use strict";

	var paths = require("./paths.js");

	module.exports = function(config) {
	  config.set({

	    // base path, that will be used to resolve files and exclude
	    basePath: '../..',


	    // frameworks to use
	    frameworks: ['mocha', 'expect', 'commonjs'],


	    // list of files / patterns to load in the browser
	    files: [
		    'src/vendor/jquery-1.10.2.js',
		    'src/vendor/ember-1.10.0.debug.js',
	      'generated/client/**/*.js'
	    ],


	    // list of files to exclude
	    exclude: [

	    ],


	    // preprocess matching files before serving them to the browser
	    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	    preprocessors: {
		    'generated/client/**/*.js': ['commonjs']
	    },


	    // test results reporter to use
	    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
	    reporters: ['progress'],


	    // web server port
	    port: 9876,


	    // enable / disable colors in the output (reporters and logs)
	    colors: true,


	    // level of logging
	    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	    logLevel: config.LOG_INFO,


	    // enable / disable watching file and executing tests whenever any file changes
	    autoWatch: false,


	    // Start these browsers, currently available:
	    // - Chrome
	    // - ChromeCanary
	    // - Firefox
	    // - Opera
	    // - Safari (only Mac)
	    // - PhantomJS
	    // - IE (only Windows)
	    browsers: [],


	    // If browser does not capture in given timeout [ms], kill it
	    captureTimeout: 60000,


	    // Continuous Integration mode
	    // if true, it capture browsers, run tests and exit
	    singleRun: false
	  });
	};

}());
