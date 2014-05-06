/* global describe, it */

var assert      = require('assert');
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
    this.coMochaTest = true;

    yield wait(100);
  });

  after(function* () {
    yield wait(100);

    assert.ok(this.coMochaTest);
  });

  describe('synchronous', function () {
    it('should pass', function () {
      assert.ok(this.coMochaTest);
    });

    it('should fail', function () {
      throw new Error('You had one job');
    });
  });

  describe('promises', function () {
    it('should pass', function () {
      assert.ok(this.coMochaTest);

      return new Promise(function (resolve) {
        return wait(100)(resolve);
      });
    });

    it('should fail', function () {
      return new Promise(function (resolve, reject) {
        return wait(100)(function () {
          return reject(new Error('You promised me'));
        });
      });
    });

    it.skip('should fail with falsy', function () {
      return new Promise(function (resolve, reject) {
        return wait(100)(function () {
          return reject(null);
        });
      });
    });
  });

  describe('callbacks', function () {
    it('should pass', function (done) {
      assert.ok(this.coMochaTest);

      return wait(100)(done);
    });

    it('should fail', function (done) {
      return wait(100)(function () {
        return done(new Error('You never called me back'));
      });
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
      '  assert.ok(this.coMochaTest);',
      '  yield wait(100);',
      '});'
    ].join('\n');

    var testErrorSource = [
      '(function* () {',
      '  yield wait(100);',
      '  throw new Error(\'This generation has failed\');',
      '});'
    ].join('\n');

    describe('es6', function () {
      it(
        'should pass',
        eval(testSource)
      );

      it(
        'should fail',
        eval(testErrorSource)
      );
    });

    describe('regenerator', function () {
      it(
        'should pass',
        eval(regenerator(testSource, { includeRuntime: true }))
      );

      it(
        'should fail',
        eval(regenerator(testErrorSource, { includeRuntime: true }))
      );
    });

    describe('traceur', function () {
      it(
        'should work',
        eval(traceur.compile(testSource).js)
      );

      it(
        'should fail',
        eval(traceur.compile(testErrorSource).js)
      );
    });
  });
});
