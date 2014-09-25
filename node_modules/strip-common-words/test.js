/*!
 * strip-common-words <https://github.com/jonschlinkert/strip-common-words>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var stripCommon = require('./');

describe('stripCommon', function () {
  it('should strip common words.', function () {
    var actual = stripCommon('foo the bar');
    assert(/foo/.test(actual));
    assert(/bar/.test(actual));
    assert(!/the/.test(actual));
  });

  it('should strip common words.', function () {
    var actual = stripCommon('one a two');
    assert(/one/.test(actual));
    assert(/two/.test(actual));
    assert(!/a/.test(actual));
  });

  it('should strip common words.', function () {
    var actual = stripCommon('install the module');
    assert(/install/.test(actual));
    assert(/module/.test(actual));
    assert(!/the/.test(actual));
  });
});
