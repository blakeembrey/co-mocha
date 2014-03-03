# co-mocha

Enable support for generators in Mocha tests using [co](https://github.com/visionmedia/co).

Currently you must use the `--harmony-generators` flag when running node 0.11.x to get access to generators.

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
