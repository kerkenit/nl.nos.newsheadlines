"use strict";

function init() {

	// Homey checks for the news headlines to be triggered
	// i.e. through phrases like
	// What are the news headlines?
	// What is the recent news?
	Homey.manager('speech-input').on('speech', function(speech,callback) {

		// Iterate over every possible trigger as specified in
		// app.json
		speech.triggers.forEach(function(trigger) {

			// Check if the newsheadline trigger is triggered
			if(trigger.id === 'newsheadline') {

				// Log that a trigger is detected
				console.log("News headline trigger detected");

				// Instantiate variables
				var dataSource,
					parsedJSON,
					newsHeadlines,
					request = require('request');

				// Download news headlines in JSON format,
				// after which we parse the JSON
				// and formulate the news headlines
				console.log('News headlines are being downloaded');
				request('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=http://feeds.feedburner.com/euronews/en/news/', function(error,response,body) {

					// Check for correctness
					if(!error && response.statusCode == 200) {

						// Log the success
						console.log('News headlines downloaded successfully');

						// Parse the XML
						parsedJSON = JSON.parse(body);

						// Concatenate everything
						newsHeadlines = [];
						newsHeadlines.push('Your recent news headlines.');
						newsHeadlines.push('One: ' + parsedJSON.responseData.feed.entries[0].title);
						newsHeadlines.push('Two: ' + parsedJSON.responseData.feed.entries[1].title);
						newsHeadlines.push('Three: ' + parsedJSON.responseData.feed.entries[2].title);
						
						// Spread the word
						for(var i = 0; i < newsHeadlines.length; i++) {
							Homey.manager('speech-output').say(__(newsHeadlines[i]));
						}

					}
					else {

						console.log('Errors have been detected');
						console.log(error);

					}

				});

			}
		});

	});
	
}

module.exports.init = init;