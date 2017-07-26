'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const testName = 'test-project';

describe('wc-generator:app', () => {
  describe('defaults', () => {
    beforeEach(() => {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          type: 'app',
          name: testName,
          installDependencies: false
        });
    });
    it('creates files', () => {
      const expected = [
        '.gitignore',
        'bower.json',
        'gulpfile.js',
        'index.html',
        'manifest.json',
        'package.json',
        'polymer.json',
        'README.md',
        'sw-precache-config.js',
        `src/${testName}.html`,
        'test/index.html',
        `test/${testName}.html`
      ];
      assert.file(expected);
    });
    it('fills package.json with correct information', () => {
      assert.JSONFileContent('package.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills bower.json with correct information', () => {
      assert.JSONFileContent('bower.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills polymer.json with correct information', () => {
      assert.JSONFileContent('polymer.json', { // eslint-disable-line new-cap
        shell: `src/${testName}.html`
      });
    });
    it('fills manifest.json with correct information', () => {
      /* eslint-disable camelcase */
      assert.JSONFileContent('manifest.json', { // eslint-disable-line new-cap
        name: testName,
        short_name: testName
      });
      /* eslint-enable camelcase */
    });
    it('fills README.md with correct information', () => {
      assert.fileContent('README.md', `# <${testName}>`);
      assert.fileContent('README.md', `\`${testName}\` is a standalone web-app built`);
    });
    it('fills index.html with correct information', () => {
      assert.fileContent('index.html', `<link rel="import" href="./src/${testName}.html">`);
    });
    it(`fills src/${testName}.html with correct information`, () => {
      assert.fileContent(`src/${testName}.html`, `<dom-module id="${testName}">`);
      assert.fileContent(`src/${testName}.html`, `\`${testName}\``);
      assert.fileContent(`src/${testName}.html`, `is: '${testName}'`);
    });
  });
});

describe('wc-generator:element', () => {
  describe('defaults', () => {
    beforeEach(() => {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          type: 'element',
          name: testName,
          installDependencies: false
        });
    });
    it('creates files', () => {
      const expected = [
        '.gitignore',
        'bower.json',
        'index.html',
        `${testName}.html`,
        'package.json',
        'README.md',
        'demo/index.html',
        'test/index.html',
        `test/${testName}.html`
      ];
      assert.file(expected);
    });
    it('fills package.json with correct information', () => {
      assert.JSONFileContent('package.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills bower.json with correct information', () => {
      assert.JSONFileContent('bower.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills README.md with correct information', () => {
      assert.fileContent('README.md', `# <${testName}>`);
      assert.fileContent('README.md', `\`${testName}\` is a reusable element built`);
    });
    it('fills index.html with correct information', () => {
      assert.fileContent('index.html', `src="./${testName}.html"`);
    });
    it(`fills ${testName}.html with correct information`, () => {
      assert.fileContent(`${testName}.html`, `<dom-module id="${testName}">`);
      assert.fileContent(`${testName}.html`, `\`${testName}\``);
      assert.fileContent(`${testName}.html`, `is: '${testName}'`);
    });
  });
});

describe('wc-generator:hello-world', () => {
  describe('defaults', () => {
    beforeEach(() => {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          type: 'hello-world',
          name: testName,
          installDependencies: false
        });
    });
    it('creates files', () => {
      const expected = [
        '.gitignore',
        'bower.json',
        'index.html',
        `${testName}.html`,
        'package.json',
        'README.md',
        'demo/index.html',
        'test/index.html',
        `test/${testName}.html`
      ];
      assert.file(expected);
    });
    it('fills package.json with correct information', () => {
      assert.JSONFileContent('package.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills bower.json with correct information', () => {
      assert.JSONFileContent('bower.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills README.md with correct information', () => {
      assert.fileContent('README.md', `# <${testName}>`);
      assert.fileContent('README.md', `\`${testName}\` is a reusable element built`);
    });
    it('fills index.html with correct information', () => {
      assert.fileContent('index.html', `src="./${testName}.html"`);
    });
    it(`fills ${testName}.html with correct information`, () => {
      assert.fileContent(`${testName}.html`, `<dom-module id="${testName}">`);
      assert.fileContent(`${testName}.html`, `\`${testName}\` is an example element`);
      assert.fileContent(`${testName}.html`, `is: '${testName}'`);
    });
  });
});

describe('wc-generator:hello-ajax', () => {
  describe('defaults', () => {
    beforeEach(() => {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          type: 'hello-ajax',
          name: testName,
          installDependencies: false
        });
    });
    it('creates files', () => {
      const expected = [
        '.gitignore',
        'bower.json',
        'index.html',
        `${testName}.html`,
        'package.json',
        'README.md',
        'demo/index.html',
        'test/index.html',
        `test/${testName}.html`
      ];
      assert.file(expected);
    });
    it('fills package.json with correct information', () => {
      assert.JSONFileContent('package.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills bower.json with correct information', () => {
      assert.JSONFileContent('bower.json', { // eslint-disable-line new-cap
        name: testName
      });
    });
    it('fills README.md with correct information', () => {
      assert.fileContent('README.md', `# <${testName}>`);
      assert.fileContent('README.md', `\`${testName}\` is a reusable element built`);
    });
    it('fills index.html with correct information', () => {
      assert.fileContent('index.html', `src="./${testName}.html"`);
    });
    it(`fills ${testName}.html with correct information`, () => {
      assert.fileContent(`${testName}.html`, `<dom-module id="${testName}">`);
      assert.fileContent(`${testName}.html`, `\`${testName}\` is an example element using async ajax`);
      assert.fileContent(`${testName}.html`, `is: '${testName}'`);
    });
  });
});
