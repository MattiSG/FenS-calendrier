#!/usr/bin/env node

var handleContent = require('./fens-2013-extract-from-page').handleContent;

console.log(handleContent(require('fs').readFileSync('./test-data/fens-data.txt').toString()));