var co = require('co')
var path = require('path')
var isGenFn = require('is-generator').fn

/**
 * Export `co-mocha`.
 */
module.exports = coMocha

/**
 * Monkey patch the mocha instance with generator support.
 *
 * @param {Function} mocha
 */
function coMocha (mocha) {
  // Avoid loading `co-mocha` twice.
  if (!mocha || mocha._coMochaIsLoaded) {
    return
  }

  var Runnable = mocha.Runnable
  var run = Runnable.prototype.run

  /**
   * Override the Mocha function runner and enable generator support with co.
   *
   * @param {Function} fn
   */
  Runnable.prototype.run = function (fn) {
    if (isGenFn(this.fn)) {
      this.fn = co.wrap(this.fn)
    }

    return run.call(this, fn)
  }

  mocha._coMochaIsLoaded = true
}

/**
 * Find active node mocha instances.
 *
 * @return {Array}
 */
function findNodeJSMocha () {
  var suffix = path.sep + path.join('', 'mocha', 'index.js')
  var children = require.cache || {}

  return Object.keys(children)
    .filter(function (child) {
      return child.slice(suffix.length * -1) === suffix
    })
    .map(function (child) {
      return children[child].exports
    })
}

// Attempt to automatically monkey patch available mocha instances.
var modules = typeof window === 'undefined' ? findNodeJSMocha() : [window.Mocha]

modules.forEach(coMocha)
