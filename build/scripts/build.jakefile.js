// Copyright (c) 2012-2015 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/* globals jake:false */

// Main build file. Contains all tasks needed for normal development.

(function() {
	"use strict";

	var startTime = Date.now();

	var shell = require("shelljs");
	var jshint = require("simplebuild-jshint");
	var karma = require("../util/karma_runner.js");
	var browserify = require("../util/browserify_runner.js");
	var version = require("../util/version_checker.js");
	var collator = require("../util/collator.js");
	var htmlbarsCompiler = require("../util/htmlbars_compiler.js");

	var browsers = require("../config/tested_browsers.js");
	var jshintConfig = require("../config/jshint.conf.js");
	var paths = require("../config/paths.js");

	var KARMA_CONFIG = "./build/config/karma.conf.js";

	var strict = !process.env.loose;


	//*** GENERAL

	desc("Lint and test");
	task("default", [ "version", "lint", "test" ], function() {
		var elapsedSeconds = (Date.now() - startTime) / 1000;
		console.log("\n\nBUILD OK  (" + elapsedSeconds.toFixed(2) + "s)");
	});

	desc("Start server (for manual testing)");
	task("run", ["build"], function() {
		jake.exec("node ./node_modules/http-server/bin/http-server " + paths.clientDistDir, { interactive: true }, complete);
	}, {async: true});

	desc("Delete generated files");
	task("clean", function() {
		console.log("rm -rf " + paths.generatedDir);
		shell.rm("-rf", paths.generatedDir);
	});


	//*** LINT

	desc("Lint everything");
	task("lint", [ "lintNode", "lintClient" ]);

	task("lintNode", function() {
		process.stdout.write("Linting Node.js code: ");
		jshint.checkFiles({
			files: [ "src/*.js", "src/server/**/*.js", "build/**/*.js" ],
			options: jshintConfig.nodeOptions,
			globals: jshintConfig.nodeGlobals
		}, complete, fail);
	}, { async: true });

	task("lintClient", function() {
		process.stdout.write("Linting browser code: ");
		jshint.checkFiles({
			files: [ "src/client/**/*.js" ],
			options: jshintConfig.clientOptions,
			globals: jshintConfig.clientGlobals
		}, complete, fail);
	}, { async: true });


	//*** TEST

	desc("Start Karma server -- run this first");
	task("karma", function() {
		karma.serve(KARMA_CONFIG, complete, fail);
	}, { async: true });

	desc("Run tests");
	task("test", [ "collateClient" ], function() {
		console.log("Testing browser code: ");
		karma.runTests({
			configFile: KARMA_CONFIG,
			browsers: browsers,
			strict: strict
		}, complete, fail);
	}, { async: true });


	//*** BUILD

	desc("Build distribution package");
	task("build", [ "prepDistDir", "buildClient" ]);

	task("prepDistDir", function() {
		shell.rm("-rf", paths.distDir);
	});

	task("buildClient", [ paths.clientDistDir, "bundleClientJs" ], function() {
		console.log("Copying client code: .");
		shell.cp("-R",
				paths.vendorSrcDir,
				paths.clientSrcDir + "/*.html",
				paths.clientSrcDir + "/*.css",
				paths.clientSrcDir + "/*.png",
			paths.clientDistDir
		);
	});

	task("bundleClientJs", [ paths.clientDistDir, "collateClient" ], function() {
		console.log("Bundling browser code with Browserify: .");
		browserify.bundle({
			entry: paths.browserifyEntryPoint,
			outfile: paths.clientDistBundle,
			options: {
				standalone: "App",
				debug: true
			}
		}, complete, fail);
	}, { async: true });

	task("collateClient", [ paths.collatedClientJsDir, "compileTemplates" ], function() {
		process.stdout.write("Collating client-side JavaScript: .");
		shell.rm("-rf", paths.collatedClientJsDir + "/*");
		collator.collate({
			src: [
				{ root: paths.compiledTemplatesDir, files: "*" },
				{ root: paths.clientSrcDir, files: "**/*.js" }
			],
			dest: paths.collatedClientJsDir
		}, complete, fail);
	}, { async: true });

	task("compileTemplates", [ paths.compiledTemplatesDir ], function() {
		process.stdout.write("Compiling HTMLBars templates: ");
		htmlbarsCompiler.compile({
			application: paths.applicationTemplateSrc,
			components: paths.componentTemplatesSrcDir + "/*.hbs",
			outfile: paths.compiledTemplatesModule
		}, complete, fail);
	}, { async: true });


	//*** CHECK VERSIONS

	desc("Check Node version");
	task("version", function() {
		console.log("Checking Node.js version: .");
		version.check({
			name: "Node",
			expected: require("../../package.json").engines.node,
			actual: process.version,
			strict: strict
		}, complete, fail);
	}, { async: true });


	//*** CREATE DIRECTORIES

	directory(paths.clientDistDir);
	directory(paths.collatedClientJsDir);
	directory(paths.compiledTemplatesDir);

}());