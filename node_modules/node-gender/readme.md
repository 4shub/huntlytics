# node-gender

A simple [node.js](http://nodejs.org) module for guessing gender based on someone's first name.

## Install

```
npm install https://github.com/martinrue/node-gender/tarball/master
```

## Usage

``` js
var gender = require('node-gender');

console.log('Marilyn is a ' + gender.find('marilyn') + ' and Gordon is a ' + gender.find('gordon'));
// Marilyn is a female and Gordon is a male
```