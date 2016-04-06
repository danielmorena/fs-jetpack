/* eslint-env jasmine */

'use strict';

describe('find | can look for directories as well', function () {
  var fse = require('fs-extra');
  var helper = require('./support/spec_helper');
  var jetpack = require('..');

  var preparations = function () {
    fse.outputFileSync('a/b/foo1', 'abc');
    fse.mkdirsSync('a/b/foo2');
  };

  var expectations = function (found, compareTo) {
    var normalizedFound = helper.convertToUnixPathSeparators(found);
    expect(normalizedFound).toEqual(compareTo);
  };

  beforeEach(helper.beforeEach);
  afterEach(helper.afterEach);

  it("doesn't look for directories by default", function (done) {
    var foundSync;
    var expectedOutcome = ['./b/foo1'];

    preparations();

    // SYNC
    foundSync = jetpack.find('a', { matching: 'foo*' }, 'relativePath');
    expectations(foundSync, expectedOutcome);

    // ASYNC
    jetpack.findAsync('a', { matching: 'foo*' }, 'relativePath')
    .then(function (foundAsync) {
      expectations(foundAsync, expectedOutcome);
      done();
    });
  });

  it('can look for files and directories', function (done) {
    var foundSync;
    var expectedOutcome = ['./b/foo1', './b/foo2'];

    preparations();

    // SYNC
    foundSync = jetpack.find('a', {
      matching: 'foo*',
      directories: true
    }, 'relativePath');
    expectations(foundSync, expectedOutcome);

    // ASYNC
    jetpack.findAsync('a', {
      matching: 'foo*',
      directories: true
    }, 'relativePath')
    .then(function (foundAsync) {
      expectations(foundAsync, expectedOutcome);
      done();
    });
  });

  it('can look for only directories', function (done) {
    var foundSync;
    var expectedOutcome = ['./b/foo2'];

    preparations();

    // SYNC
    foundSync = jetpack.find('a', {
      matching: 'foo*',
      files: false,
      directories: true
    }, 'relativePath');
    expectations(foundSync, expectedOutcome);

    // ASYNC
    jetpack.findAsync('a', {
      matching: 'foo*',
      files: false,
      directories: true
    }, 'relativePath')
    .then(function (foundAsync) {
      expectations(foundAsync, expectedOutcome);
      done();
    });
  });

  it('when you turn off files and directoies returns empty list', function (done) {
    var foundSync;
    var expectedOutcome = [];

    preparations();

    // SYNC
    foundSync = jetpack.find('a', {
      matching: 'foo*',
      files: false,
      directories: false
    }, 'relativePath');
    expectations(foundSync, expectedOutcome);

    // ASYNC
    jetpack.findAsync('a', {
      matching: 'foo*',
      files: false,
      directories: false
    }, 'relativePath')
    .then(function (foundAsync) {
      expectations(foundAsync, expectedOutcome);
      done();
    });
  });
});