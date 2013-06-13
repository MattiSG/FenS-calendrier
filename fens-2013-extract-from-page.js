require('mootools');


function handleContent(content) {
	var paragraphs = content.trim().split(/\n[\t\n ]*\n/),
		result = {};

	paragraphHandlers.forEach(function(handler, index) {
		if (paragraphs[index])
			result = Object.merge(result, handler(paragraphs[index].trim()));
	});
	
	return result;
}

function extractTime(text) {
	if (! text)
		return;

	var match = text.match(/[0-9]{1,2}[h:][0-9]{1,2}/);
	
	if (match)
		return match[0];
}

var paragraphHandlers = [
	function(paragraph) {
		var slashParts = paragraph.split('/'),
			result = {};

		['type', 'place', 'date', 'time'].forEach(function(key, index) {
			if (slashParts[index])
				result[key] = slashParts[index].trim();
		});

		if (result.time) {
			var times = result.time.split(/[à-]/);

			result.timeStart = extractTime(times[0]);
			result.timeEnd = extractTime(times[1]);
		}

		return result;
	},
	function(paragraph) {
		return { inscription: paragraph };
	},
	function(paragraph) {
		return { description: paragraph };
	},
	function(paragraph) {
		var lines = paragraph.split('\n');

		return {
			'address': lines[0],
			'web': lines[1],
			'twitter': lines[2]
		}
	},
	function(paragraph) {
		var parts = paragraph.match(/LatLng\(["']([0-9.]+)["'], ["']([0-9.]+)["']\)/);

		if (! parts)
			return {};
		
		return {
			'lat': parts[1],
			'lng': parts[2]
		}
	}
]


exports.handleContent = handleContent;
