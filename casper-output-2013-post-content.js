var casper = require('casper').create();

var url = casper.cli.get(0);

casper.start(url, function() {
	this.echo(this.fetchText('.post-content'));
}).run();
