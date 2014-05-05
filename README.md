# co-mocha

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

Not yet supported.

### `<script>` Tag

Not yet supported.

## How It Works

We monkey patch the `Runnable.prototype.run` method of `mocha` to enable generators. In contrast to other npm packages, `co-mocha` extends `mocha` at runtime - allowing you to use any compatible mocha version.

## License

MIT
