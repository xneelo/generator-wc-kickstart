/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');

// Here we add tools that will be used to process our source files.
// const imagemin = require('gulp-imagemin');

// Additional plugins can be used to optimize your source files after splitting.
// Before using each plugin, install with `npm i --save-dev <package-name>`
const uglify = require('gulp-uglify');
const cssSlam = require('css-slam').gulp;
const htmlMinifier = require('gulp-html-minifier');
const htmlMin = require('gulp-htmlmin');

const swPrecacheConfig = require('./sw-precache-config.js');
const polymerJson = require('./polymer.json');
const polymerProject = new polymerBuild.PolymerProject(polymerJson);
const buildDirectory = 'build/custom';

/**
 * Waits for the given ReadableStream
 */
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

function build() {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    // Lets create some inline code splitters in case you need them later in your build.
    let sourcesHtmlSplitter = new polymerBuild.HtmlSplitter();
    let dependenciesHtmlSplitter = new polymerBuild.HtmlSplitter();

    // Okay, so first thing we do is clear the build directory
    console.log(`Deleting ${buildDirectory} directory...`);
    del([buildDirectory])
      .then(() => {
        // Let's start by getting your source files. These are all the files
        // in your `src/` directory, or those that match your polymer.json
        // "sources"  property if you provided one.
        console.log(`Optimizing sources...`);
        let sourcesStream = polymerProject.sources()
        .pipe(sourcesHtmlSplitter.split()) // Split inline JS & CSS out into individual .js & .css files
        .pipe(gulpif(/\.js$/, uglify()))
        .pipe(gulpif(/\.css$/, cssSlam()))
        .pipe(gulpif(/\.html$/, htmlMin({
          customAttrAssign: [{source: '\\$='}],
          customAttrSurround: [
              [{source: '\\({\\{'}, {source: '\\}\\}'}],
              [{source: '\\[\\['}, {source: '\\]\\]'}]
          ],
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyJS: true,
          minifyCSS: true,
          removeComments: true
        })))
        .pipe(sourcesHtmlSplitter.rejoin()); // Rejoins those files back into their original location

        // Similarly, you can get your dependencies seperately and perform
        // any dependency-only optimizations here as well.
        console.log(`Optimizing dependencies...`);
        let dependenciesStream = polymerProject.dependencies()
          .pipe(dependenciesHtmlSplitter.split())
          .pipe(gulpif(/\.js$/, uglify()))
          .pipe(gulpif(/\.css$/, cssSlam()))
          .pipe(gulpif(/\.html$/, htmlMin({
            customAttrAssign: [{source: '\\$='}],
            customAttrSurround: [
              [{source: '\\({\\{'}, {source: '\\}\\}'}],
              [{source: '\\[\\['}, {source: '\\]\\]'}]
            ],
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            removeComments: true
          })))
          .pipe(dependenciesHtmlSplitter.rejoin());

        // Okay, now let's merge your sources & dependencies together into a single build stream.
        console.log(`Building from streams...`);
        let buildStream = mergeStream(sourcesStream, dependenciesStream)
          .once('data', () => {
            console.log('Analyzing build dependencies...');
          });

        // If you want bundling, pass the stream to polymerProject.bundler.
        // This will bundle dependencies into your fragments so you can lazy
        // load them.
        buildStream = buildStream.pipe(polymerProject.bundler());

        // Okay, time to pipe to the build directory
        buildStream = buildStream.pipe(gulp.dest(buildDirectory));

        // WaitFor the buildStream to complete
        return waitFor(buildStream);
      })
      .then(() => {
        // Okay, now let's generate the Service Worker
        console.log('Generating the Service Worker...');
        return polymerBuild.addServiceWorker({
          project: polymerProject,
          buildRoot: buildDirectory,
          bundled: true,
          swPrecacheConfig: swPrecacheConfig
        });
      })
      .then(() => {
        // You did it!
        console.log('Build complete!');
        resolve();
      })
      .catch(error => {
        console.error(error);
      });
  });
}

gulp.task('build', build);
