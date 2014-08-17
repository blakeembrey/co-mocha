# Co Mocha

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

Enable support for generators in Mocha tests using [co](https://github.com/visionmedia/co).

Use the `--harmony-generators` flag when running node 0.11.x to access generator functions, or transpile your tests using [traceur](https://github.com/google/traceur-compiler) or [regenerator](https://github.com/facebook/regenerator).

## Installation

```
npm install co-mocha --save-dev
```

## Usage

Just require the module in your tests and start writing generators in your tests.

```js
it('should do something', function* () {
  yield users.load(123);
});
```

### Node

Install the module using `npm install co-mocha --save-dev`. Now just require the module to automatically monkey patch any available `mocha` instances. With `mocha`, you have multiple ways of requiring the module - add `--require co-mocha` to your `mocha.opts` or add `require('co-mocha')` inside your main test file.

### AMD

Not currently supported.

### `<script>` Tag

Not currently supported.

## How It Works

The module monkey patches the `Runnable.prototype.run` method of `mocha` to enable generators. In contrast to other npm packages, `co-mocha` extends `mocha` at runtime - allowing you to use any compatible mocha version.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/co-mocha.svg?style=flat
[npm-url]: https://npmjs.org/package/co-mocha
[travis-image]: https://img.shields.io/travis/blakeembrey/co-mocha.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/co-mocha
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/co-mocha.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/co-mocha?branch=master
[gittip-image]: https://img.shields.io/gittip/blakeembrey.svg?style=flat
[gittip-url]: https://www.gittip.com/blakeembrey
