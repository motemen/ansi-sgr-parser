var assert = require('power-assert');
var Parser = require('../index');

describe('Parser', function () {
  beforeEach(function () {
    this.parser = new Parser;
  });

  it('parses plain text', function () {
    assert.deepEqual(
      this.parser.add('foo bar baz'),
      [ 'foo bar baz' ]
    );

    assert.deepEqual(this.parser.buf, '', 'buf is empty');
  });

  it('parses escape sequences', function () {
    assert.deepEqual(
      this.parser.add('foo\x1b[33;1mbar\x1b[m'),
      [
        'foo',
        {
          attrs: [ 'foreground yellow', 'bold' ],
          raw:   '\x1b[33;1m'
        },
        'bar',
        {
          attrs: [ 'reset' ],
          raw:   '\x1b[m'
        }
      ]
    );

    assert.deepEqual(this.parser.buf, '');
  });

  it('parses incrementally', function () {
    assert.deepEqual(
      this.parser.add('foo\x1b['),
      [
        'foo'
      ]
    );

    assert.deepEqual(this.parser.buf, '\x1b[');

    assert.deepEqual(
      this.parser.add('33m'),
      [
        {
          attrs: [ 'foreground yellow' ],
          raw:   '\x1b[33m'
        }
      ]
    );

    assert.deepEqual(this.parser.buf, '');
  });
});
