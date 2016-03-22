"use strict";

exports.init = function () {

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

				// Download news headlines in JSON format,
				// and formulate the news headlines
				Homey.log('News headlines are being downloaded');
				require('http.min').json('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=http://feeds.feedburner.com/euronews/en/news/').then(function (data) {

					// Concatenate everything
					var newsHeadlines = [];
					newsHeadlines.push('Your recent news headlines.');
					newsHeadlines.push('One: ' + data.responseData.feed.entries[0].title);
					newsHeadlines.push('Two: ' + data.responseData.feed.entries[1].title);
					newsHeadlines.push('Three: ' + data.responseData.feed.entries[2].title);
					
					// Spread the word
					for(var i = 0; i < newsHeadlines.length; i++) {
						Homey.manager('speech-output').say(__(newsHeadlines[i]));
					}

				});

			}
		});

	});
	
};
