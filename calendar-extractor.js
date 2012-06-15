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

var handlers = {
	'.dates':	/Date : (.+)/,
	'.lieu':	/Lieu : (.+)/,
	'.adresse':	/Adresse : (.+)/,
	'.adresse + div':	/Horaires : (.+)/,
	'.adresse + div + div':	/Type : (.+)/,
	'.adresse + div + div + div':	/Evénement : (.+)/,
	'.adresse + div + div + div + div':	/Tarif : (.+)/,
}

function extractData(selector, type) {
	var result = casper.fetchText(selector);
	
	if (result)
		result = new RegExp(type + ' : (.+)').exec(result);
	
	if (result)
		result = result[1].trim();
	
	return result;
}

function extractDate(result) {
	result.date = extractData('.dates', 'Date');
}

function extractTime(result) {
	var titleExtractedTime = / \/ (.+)/.exec(result.title);
	
	if (titleExtractedTime) {
		titleExtractedTime = titleExtractedTime[1];
		result.title = result.title.replace(' / ' + titleExtractedTime, '');
	}
	
	result.time = (titleExtractedTime || extractData('.adresse + div', 'Horaires'));
}

var loadEvent = function loadEvent(url, callback) {
	console.log('loading url', url);
	casper.thenOpen(url, function buildEvent() {
		console.log('callback for', url);
		var result = {
			url: url
		}
		
		result.title = casper.fetchText('h1');
		
		extractDate(result);
		extractTime(result);
		
		callback(result);
	});
}


var urls = [];


casper.start('http://www.futur-en-seine.fr/calendrier/', function main() {
	var events = findAllEvents();
	var urls = events.urls;
	for (var i = 0; i < 3/*urls.length*/; i++)
		loadEvent(urls[i], function(values) {
			for (var key in values)
				if (values.hasOwnProperty(key))
					console.log(key, '->', values[key]);
		});
});

casper.run();