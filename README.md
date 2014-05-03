# co-mocha

Enable support for generators in Mocha tests using [co](https://github.com/visionmedia/co).

Currently you must either use the `--harmony-generators` flag when running node 0.11.x to get access to generators or transpile your tests using traceur.

## Installation

```
npm install co-mocha --save-dev
```

## Usage

Add `--require co-mocha` to your `mocha.opts`. Now you can write your tests using generators.

Alternatively you can also just `require('co-mocha')` in your test file.

```js
it('should do something', function* () {
  yield users.load(123);
});
```

## How it works

`co-mocha` interally overwrites mocha's `Runnable.prototype.run`. In contrast to the other npm package `mocha-co` it isn't a mocha fork but just extends mocha's functionality.

## License

MIT
