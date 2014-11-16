var co      = require('co');
var path    = require('path');
var isGenFn = require('is-generator').fn;

/**
 * Monkey patch the mocha instance with generator support.
 *
 * @param {Function} mocha
 */
var coMocha = module.exports = function (mocha) {
  // Avoid loading `co-mocha` twice.
  if (mocha._coMochaIsLoaded) {
    return;
  }

  var Runnable = mocha.Runnable;
  var run      = Runnable.prototype.run;

  /**
   * Override the Mocha function runner and enable generator support with co.
   *
   * @param {Function} fn
   */
  Runnable.prototype.run = function (fn) {
    if (isGenFn(this.fn)) {
      this.fn = co.wrap(this.fn);
    }

    return run.call(this, fn);
  };

  return mocha._coMochaIsLoaded = true;
};

/**
 * Find active node mocha instances.
 *
 * @return {Array}
 */
var findNodeJSMocha = function () {
  var suffix   = path.sep + path.join('', 'mocha', 'index.js');
  var children = require.cache || {};

  return Object.keys(children).filter(function (child) {
    return child.slice(suffix.length * -1) === suffix;
  }).map(function (child) {
    return children[child].exports;
  });
};

/**
 * Attempt to automatically monkey patch available mocha instances.
 */
try {
  var modules = [];

  if (typeof require === 'function' && typeof exports === 'object') {
    modules = findNodeJSMocha();
  }

  modules.forEach(coMocha);
} catch (e) {}
