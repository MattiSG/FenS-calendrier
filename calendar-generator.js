var casper = require('casper').create({
	verbose: true
});


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

function extractDates(result) {
	result.dates = extractData('.dates', 'Date');
	
	if (result.dates)	//single-day event
		return result.dates = [ result.dates.replace(/ ?juin/i, '') ];
		
	result.dates = extractData('.dates', 'Dates');
	
	if (result.dates)	//multi-day event
		return result.dates = result.dates.replace(/ ?juin/i, '').split(',');
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
	var split = /([0-9]{1,2})h?([0-9]{2})? ?-? ?([0-9]{1,2})?h?([0-9]{2})?/.exec(result.time);
	if (split) {
		result.time = {
			start: (split[1] || '00') + (split[2] || '00'),
			end: (split[3] || '00') + (split[4] || '00')
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
		extractDates(result);
		extractTime(result);
		splitTime(result);
		
		callback(result);
	});
}

var exportToICal = function exportToICal(event) {
	var result = '';

	if (event.dates) {
		for (var i = 0; i < event.dates.length; i++) {
			event.date = event.dates[i].trim();
			result += exportOneToICal(event);
		}
	}
	
	return result;
}

var exportOneToICal = function exportOneToICal(event) {
	var result = [
		'BEGIN:VEVENT',
		'SUMMARY:' + event.title,
		'URL:' + event.url
	];
	
	if (event.summary)
		result.push('DESCRIPTION:' + event.summary.replace(/\n/g, ' '));
	
	if (event.place)
		result.push('LOCATION:' + event.place);
	
	if (event.date && event.time && event.time.start)
		result.push('DTSTART:201206' + event.date	// easy: the date necessarily has two digits
					+ 'T' + event.time.start
					+ '00');

	if (event.date && event.time && event.time.end != '0000')
		result.push('DTEND:201206' + event.date
					+ 'T' + event.time.end
					+ '00');
		
	result.push('END:VEVENT');
	result.push('');
	
	return result.join('\n');
}


casper.cli.drop("cli");
casper.cli.drop("casper-path");

casper.start('http://google.fr', function() {
	for (var i in casper.cli.args) {
		if (casper.cli.args.hasOwnProperty(i)) {
			loadEvent(casper.cli.args[i], function(values) {
				if (values.dates)
					console.log(
						exportToICal(values)
					);
				else
					console.error('Missing date for', values.url, ' :(');
			});
		}
	}
});

casper.run();