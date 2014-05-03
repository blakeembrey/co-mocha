var co       = require('co');
var mocha    = require('mocha');
var Runnable = mocha.Runnable;
var run      = Runnable.prototype.run;

/**
 * Override the Mocha function runner and enable generator support with co.
 *
 * @param {Function} fn
 */
Runnable.prototype.run = function (fn) {
  var result = this.fn();

  if (typeof(result.next) == 'function' &&
      typeof(result.throw) == 'function') {
    this.fn   = co(result);
    this.sync = !(this.async = true);
  }

  return run.call(this, fn);
};
