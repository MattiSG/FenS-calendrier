#!/usr/bin/env node

var fs = require('fs');

var handleContent = require('./fens-2013-extract-from-page').handleContent,
	getUrls = require('./get-2013-urls'),
	extract = require('./extract-content-from-2013-event.js');

var CONCURRENT_EXTRACTIONS = 3;

//getUrls(console.log);

// getUrls(function(err, urls) {
// 	var url = urls[0];
// 	console.log('Loading', url);

// 	extract(url, function(content) {
// 		console.log(handleContent(content));
// 	});
// });

//console.log(handleContent(require('fs').readFileSync('test-data/fens-data-4.txt').toString()));

getUrls(function(error, urls) {
	function handleOne(index) {
		if (index >= urls.length)
			return;

		var url = urls[index],
			parts = url.split('/'),
			filename = 'content/' + parts[parts.length - 2] + '.txt';	// folder name, not index.html

		if (fs.existsSync(filename)) {
			var result = handleContent(fs.readFileSync(filename).toString());
			result.source = filename;
			console.log(result);

			return handleOne(index + 1);
		}

		console.log('Loading ' + url + '…');

		extract(url, function(content) {
			fs.writeFile(filename, content, function(err) {
				if (err)
					return console.log('Error writing', filename);
				
				console.log('Wrote', filename);
			});
			
			handleOne(index + 1);
		});
	}
	
	handleOne(0);
});
