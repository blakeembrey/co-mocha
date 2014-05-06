var co          = require('co');
var path        = require('path');
var Promise     = require('bluebird');
var isGenerator = require('is-generator');

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
    var func = this.fn;

    if (this.sync) {
      this.fn = function () {
        var result = func.call(this);

        // If the function returned a generator, pass the object to `co` and
        // transform the result into a promise for compatibility with `mocha`.
        // We are checking the function return since not all transpilers
        // (looking at you, traceur) provide a method for detecting generator
        // functions but all will return generator-like objects.
        if (isGenerator(result)) {
          return Promise.promisify(co(result), this)();
        }

        return result;
      };
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
  var children = require.main && require.main.children || [];

  return children.filter(function (child) {
    return child.id.slice(suffix.length * -1) === suffix;
  }).map(function (child) {
    return child.exports;
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
