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

function extractPlace(result) {
	result.place = extractData('.lieu', 'Lieu');
	
	var address = extractData('.address', 'Adresse');
	if (address)
		result.place += ', ' + address;
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

function extractSummary(result) {
	result.summary = casper.fetchText('.fiche-header-text div p:first-child');
}

function splitTime(result) {
	var split = /([0-9]{1,2})h? ?-? ?([0-9]{0,2})h?/.exec(result.time);
	if (split) {
		result.time = {
			from: split[1],
			to: split[2]
		}
	}
}

var loadEvent = function loadEvent(url, callback) {
	casper.thenOpen(url, function buildEvent() {
		console.log('\n==========\n');
		var result = {
			url: url
		}
		
		result.title = casper.fetchText('h1');
		
		extractSummary(result);
		extractPlace(result);
		extractDate(result);
		extractTime(result);
		splitTime(result);
		
		callback(result);
	});
}


var urls = [];


casper.start('http://www.futur-en-seine.fr/calendrier/', function main() {
	var events = findAllEvents();
	var urls = events.urls;
	for (var i = 0; i < 10/*urls.length*/; i++)
		loadEvent(urls[i], function(values) {
			for (var key in values) {
				if (values.hasOwnProperty(key)) {
					if (values[key])
						console.log(key, '-> "' + values[key] + '"');
				}
			}
		});
});

casper.run();