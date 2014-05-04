/* global describe, it */

var traceur     = require('traceur');
var Promise     = require('bluebird');
var regenerator = require('regenerator');

/**
 * Wait a certain amount of time before proceeding to the callback.
 *
 * @param  {Number}   ms
 * @return {Function}
 */
var wait = function (ms) {
  return function (fn) {
    setTimeout(fn, ms);
  };
};

describe('co-mocha', function () {
  before(function* () {
    yield wait(100);
  });

  after(function* () {
    yield wait(100);
  });

  it('should work synchronously', function () {});

  it('should error synchronously', function () {
    throw new Error('You had one job');
  });

  it('should work with promises', function () {
    return new Promise(function (resolve) {
      return wait(100)(resolve);
    });
  });

  it('should error with promises', function () {
    return new Promise(function (resolve, reject) {
      return wait(100)(function () {
        return reject(new Error('You promised me'));
      });
    });
  });

  it('should work with callbacks', function (done) {
    return wait(100)(done);
  });

  it('should error with callbacks', function (done) {
    return wait(100)(function () {
      return done(new Error('You never called me back'));
    });
  });

  describe('generators', function () {
    /**
     * String version of generator based test. This will be used to compile for
     * testing different ES6 to ES5 transpilers.
     *
     * @type {Array}
     */
    var testSource = [
      '(function* () {',
      '  yield wait(100);',
      '});'
    ].join('\n');

    var testErrorSource = [
      '(function* () {',
      '  yield wait(100);',
      '  throw new Error(\'This generation has failed\');',
      '});'
    ].join('\n');

    it(
      'should work with es6 generators',
      eval(testSource)
    );

    it(
      'should error with es6 generators',
      eval(testErrorSource)
    );

    it(
      'should work with regenerator generators',
      eval(regenerator(testSource, { includeRuntime: true }))
    );

    it(
      'should error with regenerator generators',
      eval(regenerator(testErrorSource, { includeRuntime: true }))
    );

    it(
      'should work with traceur generators',
      eval(traceur.compile(testSource).js)
    );

    it(
      'should error with traceur generators',
      eval(traceur.compile(testErrorSource).js)
    );
  });
});
