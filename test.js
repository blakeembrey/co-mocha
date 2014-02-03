/* global describe, it */

var assert = require('assert');

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

  it('should work synchronously', function () {
    assert.equal(1 + 1, 2);
  });

  it('should work with generators', function* () {
    assert.equal(1 + 1, 2);
    yield wait(100);
  });

  it('should work with with callbacks', function (done) {
    assert.equal(1 + 1, 2);
    wait(100)(done);
  });
});
