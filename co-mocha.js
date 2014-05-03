var denodeify = require('rsvp').denodeify;
var co        = require('co');
var mocha     = require('mocha');
var Runnable  = mocha.Runnable;
var run       = Runnable.prototype.run;

/**
 * Override the Mocha function runner and enable generator support with co.
 *
 * @param {Function} fn
 */
Runnable.prototype.run = function (fn) {
  var func = this.fn;

  if (!this.async) {
    this.fn = function() {
      var result = func();
      var isIterator = result && result.next && result.throw;
      if (isIterator) {
        // If result is an iterator, return a promise
        return denodeify(co(result))();
      } else {
        return result;
      }
    }
  }

  return run.call(this, fn);
};
