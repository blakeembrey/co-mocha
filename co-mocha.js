var co          = require('co');
var path        = require('path');
var isPromise   = require('is-promise');
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
