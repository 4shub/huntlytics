/*!
 * strip-common-words <https://github.com/jonschlinkert/strip-common-words>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var common = require('common-words');
var words = [];
common.forEach(function(obj) {
  words.push(obj.word);
});

module.exports = function(str) {
  var wordRegex = '([\\s\\W]+)(?:' + words.join('|') + ')([\\s\\W]+)';
  return str.replace(new RegExp(wordRegex, 'gi'), '$1$2');
};