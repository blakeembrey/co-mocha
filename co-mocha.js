var co          = require('co');
var mocha       = require('mocha');
var isPromise   = require('is-promise');
var isGenerator = require('is-generator');
var Runnable    = mocha.Runnable;
var run         = Runnable.prototype.run;

/**
 * Override the Mocha function runner and enable generator support with co.
 *
 * @param {Function} fn
 */
Runnable.prototype.run = function (fn) {
  var func = this.fn;
  var sync = this.sync;

  // Flip the async switch to always have a callback function provided.
  this.sync = !(this.async = true);

  // Override the function to provide a special generator handler.
  this.fn = function (done) {
    var result = sync ? func() : func(done);

    if (isGenerator(result)) {
      return co(result)(done);
    }

    if (isPromise(result)) {
      return result.then(function () {
        return done();
      }, done);
    }

    return sync && done();
  };
  return run.call(this, fn);
};
