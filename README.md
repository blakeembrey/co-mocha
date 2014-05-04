# co-mocha

Enable support for generators in Mocha tests using [co](https://github.com/visionmedia/co).

Use the `--harmony-generators` flag when running node 0.11.x to access generator functions, or transpile your tests using [traceur](https://github.com/google/traceur-compiler) or [regenerator](https://github.com/facebook/regenerator).

## Installation

```
npm install co-mocha --save-dev
```

## Usage

Add `--require co-mocha` to your `mocha.opts`. Now you can write your tests using generators.

```js
it('should do something', function* () {
  yield users.load(123);
});
```

## License

MIT
