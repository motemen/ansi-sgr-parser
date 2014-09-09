'use strict';

// CSI <n> ( ';' <n> )* 'm'

var SGR_NAMES = {
   0: 'reset',
   1: 'bold',
   4: 'underline',
   5: 'blink',
   7: 'invert',
  22: 'no-bold',
  24: 'no-underline',
  25: 'no-blink',
  27: 'no-invert',
  30: 'foreground-black',
  31: 'foreground-red',
  32: 'foreground-green',
  33: 'foreground-yellow',
  34: 'foreground-blue',
  35: 'foreground-magenta',
  36: 'foreground-cyan',
  37: 'foreground-white',
  39: 'foreground-default',
  40: 'background-black',
  41: 'background-red',
  42: 'background-green',
  43: 'background-yellow',
  44: 'background-blue',
  45: 'background-magenta',
  46: 'background-cyan',
  47: 'background-white',
  49: 'background-default'
};

function Parser () {
  this.buf = '';
}

Parser.prototype.add = function (string) {
  this.buf += string;

  var result = [];

  while (true) {
    var matched = false;

    this.buf = this.buf.replace(/^(?:([^\x1b]+)|(?:\x1b\[(\d*(?:;\d*)*)([a-zA-Z])))/, function (whole, normal, attrs, type) {
      matched = true;

      if (typeof normal === 'string') {
        result.push(normal);
      } else if (typeof attrs === 'string') {
        result.push({
          attrs: attrs.split(/;/).map(function (attr) {
            return SGR_NAMES[attr || 0];
          }),
          raw: whole
        });
      }
      return '';
    });

    if (!matched) break;
  }

  return result;
};

module.exports = Parser;
