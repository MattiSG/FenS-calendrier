var casper = require('casper').create({
	verbose: true
});

var findAllEvents = function findAllEvents() {
	return casper.evaluate(function() {
		var result = {
			urls: []
		}
		
		$('.box').children('a').each(function(index, elm) {
			result.urls.push($(elm).attr('href'));
		});
		
		return result;
	});
}

casper.start('http://www.futur-en-seine.fr/calendrier/', function main() {
	var events = findAllEvents();
	var urls = events.urls;	

	console.log(urls.join('\n'));
});

casper.run(function() {
	casper.exit();
});