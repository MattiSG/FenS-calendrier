var casper = require('casper').create({
	verbose: true
});

var BATCH_SIZE = 5;	// how many URLs will be loaded at once by the generator?
					// increasing this value improves performance as it leverages PhantomJS' cache
					// but it decreases reliability, as PhantomJS tends to crash when too many operations are done in a row

var findAllEvents = function findAllEvents() {
	return casper.evaluate(function() {
		var result = {}	// hash to unique out URLs
		
		$('.box').children('a').each(function(index, elm) {
			result[$(elm).attr('href')] = true;
		});
		
		return result;
	});
}

casper.start('http://www.futur-en-seine.fr/calendrier/', function main() {
	var events = findAllEvents();
	var urls = [];
	
	var i = 0;
	
	for (var url in events)
		if (events.hasOwnProperty(url))
			urls.push(i % BATCH_SIZE == 0
					  ? url
					  : urls.pop() + ' ' + url
					 );

	console.log(urls.join('\n'));
});

casper.run(function() {
	casper.exit();
});