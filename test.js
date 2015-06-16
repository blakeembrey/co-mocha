/* eslint-disable no-eval */
/* global describe, it, chai, ES6Promise */

var expect
var Runnable
var isNode = typeof require === 'function'

if (isNode) {
  expect = require('chai').expect
  Runnable = require('mocha').Runnable
} else {
  expect = chai.expect
  Runnable = window.Mocha.Runnable

  ES6Promise.polyfill()
}

/**
 * Thunkify a function for `process.nextTick`.
 *
 * @return {Function}
 */
function defer () {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0)
  })
}

describe('co-mocha', function () {
  describe('synchronous', function () {
    it('should pass', function (done) {
      var test = new Runnable('synchronous', function () {})

      test.run(done)
    })

    it('should fail', function (done) {
      var test = new Runnable('synchronous', function () {
        throw new Error('You had one job')
      })

      test.run(function (err) {
        expect(err).to.exist
        expect(err.message).to.equal('You had one job')

        return done()
      })
    })
  })

  describe('promise', function () {
    it('should pass', function (done) {
      var test = new Runnable('promise', function () {
        return defer()
      })

      test.run(done)
    })

    it('should fail', function (done) {
      var test = new Runnable('promise', function () {
        return new Promise(function (resolve, reject) {
          return setTimeout(function () {
            return reject(new Error('You promised me'))
          }, 0)
        })
      })

      test.run(function (err) {
        expect(err).to.exist
        expect(err.message).to.equal('You promised me')

        return done()
      })
    })
  })

  describe('callback', function () {
    it('should pass', function (done) {
      var test = new Runnable('callback', function (done) {
        return setTimeout(done, 0)
      })

      test.run(done)
    })

    it('should fail', function (done) {
      var test = new Runnable('callback', function (done) {
        return setTimeout(function () {
          return done(new Error('You never called me back'))
        }, 0)
      })

      test.run(function (err) {
        expect(err).to.exist
        expect(err.message).to.equal('You never called me back')

        return done()
      })
    })
  })

  describe('generators', function () {
    var TEST_SOURCE = [
      '(function * () {',
      '  yield defer()',
      '})'
    ].join('\n')

    var TEST_ERROR_SOURCE = [
      '(function * () {',
      '  yield defer()',
      '  throw new Error(\'This generation has failed\')',
      '})'
    ].join('\n')

    describe('es6', function () {
      try {
        eval('(function * () {})')
      } catch (e) {
        console.log('Generators are not supported natively, skipping...')

        return
      }

      it('visual debugging', function * () {
        yield Promise.resolve('This is purely for testing Mocha HTML output')
      })

      it('should pass', function (done) {
        var test = new Runnable('es6', eval(TEST_SOURCE))

        test.run(done)
      })

      it('should fail', function (done) {
        var test = new Runnable('es6', eval(TEST_ERROR_SOURCE))

        test.run(function (err) {
          expect(err).to.exist
          expect(err.message).to.equal('This generation has failed')

          return done()
        })
      })
    })

    if (isNode) {
      var traceur = require('traceur')
      var regenerator = require('regenerator')

      describe('regenerator', function () {
        it('should pass', function (done) {
          var test = new Runnable('regenerator', eval(regenerator.compile(TEST_SOURCE, {
            includeRuntime: true
          }).code))

          test.run(done)
        })

        it('should fail', function (done) {
          var test = new Runnable('regenerator', eval(
            regenerator.compile(TEST_ERROR_SOURCE, {
              includeRuntime: true
            }).code
          ))

          test.run(function (err) {
            expect(err).to.exist
            expect(err.message).to.equal('This generation has failed')

            return done()
          })
        })
      })

      describe('traceur', function () {
        it('should pass', function (done) {
          var test = new Runnable(
            'regenerator', eval(traceur.compile(TEST_SOURCE))
          )

          test.run(done)
        })

        it('should fail', function (done) {
          var test = new Runnable(
            'regenerator', eval(traceur.compile(TEST_ERROR_SOURCE))
          )

          test.run(function (err) {
            expect(err).to.exist
            expect(err.message).to.equal('This generation has failed')

            return done()
          })
        })
      })
    }
  })
})
