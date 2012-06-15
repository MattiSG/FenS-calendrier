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
	
	if (result.date)
		result.date = result.date.replace(/ ?juin/i, '');
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
			start: split[1],
			end: split[2]
		}
	}
}

var loadEvent = function loadEvent(url, callback) {
	casper.thenOpen(url, function buildEvent() {
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


var iCalHeader = function iCalHeader() {
	var result = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:MattiSG_FuturEnSeine'
	];
	
	return result.join('\n');	
}

var exportToICal = function exportToICal(event) {
	var result = [
		'BEGIN:VEVENT',
		'UID:' + event.title.replace(/ /g, '_'),
		'SUMMARY:' + event.title,
		'URL:' + event.url
	];
	
	if (event.summary)
		result.push('DESCRIPTION:' + event.summary.replace(/\n/g, ' '));
	
	if (event.place)
		result.push('LOCATION:' + event.place);
	
	if (event.date && event.time && event.time.start)
		result.push('DTSTART:201206' + event.date	// easy: the date necessarily has two digits
					+ 'T' + event.time.start + '0000Z');

	if (event.date && event.time && event.time.end)
		result.push('DTEND:' + event.date + 'T' + event.time.start);
		
	result.push('END:VEVENT');
	
	return result.join('\n');
}

var iCalFooter = function iCalFooter() {
	return 'END:VCALENDAR';
}


casper.start('http://www.futur-en-seine.fr/calendrier/', function main() {
	var events = findAllEvents();
	var urls = events.urls;

	console.log(iCalHeader());
	for (var i = 0; i < urls.length; i++) {
		loadEvent(urls[i], function(values) {
			if (values.date)
				console.log(exportToICal(values));
//			else
//				console.error('Missing date for', values.url, ' :(');
/*			for (var key in values) {
				if (values.hasOwnProperty(key)) {
					if (values[key])
						console.log(key, '-> "' + values[key] + '"');
				}
			}
*/
		});
	}
});

casper.run(function() {
	console.log(iCalFooter());
	
	casper.exit();
});