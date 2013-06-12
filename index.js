#!/usr/bin/env node

var handleContent = require('./fens-2013-extract-from-page').handleContent,
	getUrls = require('./get-2013-urls');

getUrls(console.log);
console.log(handleContent(require('fs').readFileSync('./test-data/fens-data.txt').toString()));