/* global describe, it */

var mocha       = require('mocha');
var assert      = require('assert');
var traceur     = require('traceur');
var Bluebird    = require('bluebird');
var regenerator = require('regenerator');
var coMocha     = require('./')(mocha);
var Runnable    = mocha.Runnable;

/**
 * Thunkify a function for `process.nextTick`.
 *
 * @return {Function}
 */
var nextTick = function () {
  return process.nextTick;
};

describe('co-mocha', function () {
  describe('synchronous', function () {
    it('should pass', function (done) {
      var test = new Runnable('synchronous', function () {});

      test.run(done);
    });

    it('should fail', function (done) {
      var test = new Runnable('synchronous', function () {
        throw new Error('You had one job');
      });

      test.run(function (err) {
        assert.ok(err);
        assert.equal(err.message, 'You had one job');

        return done();
      })
    });
  });

  describe('promise', function () {
    it('should pass', function (done) {
      var test = new Runnable('promise', function () {
        return new Bluebird(function (resolve) {
          return nextTick()(resolve);
        });
      });

      test.run(done);
    });

    it('should fail', function (done) {
      var test = new Runnable('promise', function () {
        return new Bluebird(function (resolve, reject) {
          return nextTick()(function () {
            return reject(new Error('You promised me'));
          });
        });
      });

      test.run(function (err) {
        assert.ok(err);
        assert.equal(err.message, 'You promised me');

        return done();
      })
    });
  });

  describe('callback', function () {
    it('should pass', function (done) {
      var test = new Runnable('callback', function (done) {
        return nextTick()(done);
      });

      test.run(done);
    });

    it('should fail', function (done) {
      var test = new Runnable('callback', function (done) {
        return nextTick()(function () {
          return done(new Error('You never called me back'));
        });
      });

      test.run(function (err) {
        assert.ok(err);
        assert.equal(err.message, 'You never called me back');

        return done();
      })
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
      '  yield nextTick();',
      '});'
    ].join('\n');

    var testErrorSource = [
      '(function* () {',
      '  yield nextTick();',
      '  throw new Error(\'This generation has failed\');',
      '});'
    ].join('\n');

    describe('es6', function () {
      it('should pass', function (done) {
        var test = new Runnable('es6', eval(testSource));

        test.run(done);
      });

      it('should fail', function (done) {
        var test = new Runnable('es6', eval(testErrorSource));

        test.run(function (err) {
          assert.ok(err);
          assert.equal(err.message, 'This generation has failed');

          return done();
        });
      });
    });

    describe('regenerator', function () {
      it('should pass', function (done) {
        var test = new Runnable('regenerator', eval(regenerator(testSource, {
          includeRuntime: true
        })));

        test.run(done);
      });

      it('should fail', function (done) {
        var test = new Runnable('regenerator', eval(
          regenerator(testErrorSource, {
            includeRuntime: true
          })
        ));

        test.run(function (err) {
          assert.ok(err);
          assert.equal(err.message, 'This generation has failed');

          return done();
        });
      });
    });

    describe('traceur', function () {
      it('should pass', function (done) {
        var test = new Runnable(
          'regenerator', eval(traceur.compile(testSource).js)
        );

        test.run(done);
      });

      it('should fail', function (done) {
        var test = new Runnable(
          'regenerator', eval(traceur.compile(testErrorSource).js)
        );

        test.run(function (err) {
          assert.ok(err);
          assert.equal(err.message, 'This generation has failed');

          return done();
        });
      });
    });
  });
});
