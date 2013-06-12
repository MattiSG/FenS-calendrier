var fs = require('fs'),
	pathUtils = require('path');

var dataFolder = 'data/2013';

function getUrls(callback) {
	fs.readdir(dataFolder, function(err, folders) {
		if (err)
			return callback(err);

		var result = [];

		folders.forEach(function(folder) {
			result.push(makeUrl(folder));
		});

		return callback(null, result);
	});
}

function makeUrl(eventName) {
	return 'file://' + pathUtils.join(__dirname, dataFolder, eventName);
}


module.exports = getUrls;