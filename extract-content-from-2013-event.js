var process = require('child_process');

function extract(url, callback) {
	var extractor = process.spawn('casperjs', ['casper-output-2013-post-content.js', url]);

	extractor.stdout.on('data', function(data) {
		callback(data.toString());
	});
}


module.exports = extract;