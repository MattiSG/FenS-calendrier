#!/usr/bin/env node

var handleContent = require('./fens-2013-extract-from-page').handleContent,
	getUrls = require('./get-2013-urls'),
	extract = require('./extract-content-from-2013-event.js');

//getUrls(console.log);

getUrls(function(err, urls) {
	var url = urls[0];
	console.log('Loading', url);

	extract(url, function(content) {
		console.log(handleContent(content));
	});
});

//console.log(handleContent(require('fs').readFileSync('test-data/fens-data-4.txt').toString()));

// getUrls(function(error, urls) {
// 	function handleOne(index) {
// 		var url = urls[index];
// 		console.log('Loading ' + url + '…');
// 		extract(url, function(content) {
// 			console.log('Loaded ' + url + '. Extracting content…')
// 			console.log(handleContent(content));
// 			handleOne(index + 1);
// 		});
// 	}
	
// 	handleOne(0);
// });
