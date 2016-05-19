"use strict";
exports.init = function() {
	var striptags = require('striptags');

	var numberOfNewsArticles = Homey.manager('settings').get('numberOfNewsArticles');
	if (numberOfNewsArticles === undefined || numberOfNewsArticles === null) {
		// Set the standard number of news headlines to 20
		Homey.manager('settings').set('numberOfNewsArticles', 5);
	}
	var headlineKeywords = [__('app.numbers.one'), __('app.numbers.two'), __('app.numbers.three'), __('app.numbers.four'), __('app.numbers.five'), __('app.numbers.six'), __('app.numbers.seven'), __('app.numbers.eight'), __('app.numbers.nine'), __('app.numbers.ten'), __('app.numbers.eleven'), __('app.numbers.twelve'), __('app.numbers.thirteen'), __('app.numbers.fourteen'), __('app.numbers.fiveteen'), __('app.numbers.sixteen'), __('app.numbers.seventeen'), __('app.numbers.eightteen'), __('app.numbers.nineteen'), __('app.numbers.twenty')];

	var formatHeadline = function(text) {
		text = text.replace('"', '');
		text = text.replace("'", "");
		text = text.replace("\"", "");
		text = striptags(text).substr(0, 255);
		var index = text.lastIndexOf('.');
		return [text.slice(0, index), text.slice(index + 1)][0]+'.';
	};

	var replaceContent = function(text) {
		text = text.replace(__('app.findandreplace.kmph.find'), __('app.findandreplace.kmph.replace'));
		text = text.replace(__('app.findandreplace.mph.find'), __('app.findandreplace.mph.replace'));
		text = text.replace(__('app.findandreplace.co2.find'), __('app.findandreplace.co2.replace'));
		text = text.replace(__('app.findandreplace.rivm.find'), __('app.findandreplace.rivm.replace'));
		text = text.replace(__('app.findandreplace.om.find'), __('app.findandreplace.om.replace'));
		text = text.replace(__('app.findandreplace.rdw.find'), __('app.findandreplace.rdw.replace'));
		text = text.replace(__('app.findandreplace.who.find'), __('app.findandreplace.who.replace'));
		text = text.replace(__('app.findandreplace.bbc.find'), __('app.findandreplace.bbc.replace'));
		text = text.replace(__('app.findandreplace.youp.find'), __('app.findandreplace.youp.replace'));
		return text;
	};
	// Homey checks if it should read the news
	Homey.manager('flow').on('action.readNews', function(callback) {
		// Read the news
		// Download news headlines in JSON format,
		// and formulate the news headlines
		Homey.log('News headlines are being downloaded');		require('http.min').json('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=http://feeds.nos.nl/nosjournaal').then(function(data) {
			if (data !== undefined && data !== null && data.responseData !== undefined && data.responseData !== null && data.responseData.feed !== undefined && data.responseData.feed !== null && data.responseData.feed.entries !== undefined && data.responseData.feed.entries !== null && data.responseData.feed.entries.length > 0) {
				// Concatenate everything
				var newsHeadlines = [];
				var Headlines = [];
				var maxNews = Homey.manager('settings').get('numberOfNewsArticles');
				maxNews = (maxNews > 20 ? 20 : (maxNews < 1 ? 1 : maxNews)); // Minimum of 1 article, maximum of 20 articles (~source limit)
				newsHeadlines.push(__('app.speechPrefix'));
				for (var i = 0; i < maxNews; i++) {
					if(data.responseData.feed.entries[i].title !== undefined) {
						var title = replaceContent(data.responseData.feed.entries[i].title);
						var content = replaceContent(data.responseData.feed.entries[i].content);
						if (title.length > 0 && content.length > 0) {
							newsHeadlines.push(formatHeadline(headlineKeywords[i] + '. ' + title + '. ' + content));
						}
						title = null;
						content = null;
					}
				}
				// Spread the word
				for (var j = 0; j < newsHeadlines.length; j++) {
					//Homey.log(newsHeadlines[j].length);
					//Homey.log(newsHeadlines[j]);
					Homey.manager('speech-output').say(__(newsHeadlines[j]));
				}
				callback(null, true);
			} else {
				callback(null, false);
			}
		});
	});
	// Homey checks for the news headlines to be triggered
	// i.e. through phrases like
	// What are the news headlines?
	// What is the recent news?
	Homey.manager('speech-input').on('speech', function(speech, callback) {
		// Iterate over every possible trigger as specified in
		// app.json
		speech.triggers.forEach(function(trigger) {
			// Check if the newsheadline trigger is triggered
			if (trigger.id === 'newsheadline') {
				// Read the news
				// Download news headlines in JSON format,
				// and formulate the news headlines
				Homey.log('News headlines are being downloaded');
				var striptags = require('striptags');
				require('http.min').json('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=http://feeds.nos.nl/nosjournaal').then(function(data) {
					if (data !== undefined && data !== null && data.responseData !== undefined && data.responseData !== null && data.responseData.feed !== undefined && data.responseData.feed !== null && data.responseData.feed.entries !== undefined && data.responseData.feed.entries !== null && data.responseData.feed.entries.length > 0) {
						// Concatenate everything
						var newsHeadlines = [];
						var maxNews = Homey.manager('settings').get('numberOfNewsArticles');
						maxNews = (maxNews > 20 ? 20 : (maxNews < 1 ? 1 : maxNews)); // Minimum of 1 article, maximum of 20 articles (~source limit)
						newsHeadlines.push(__('app.speechPrefix'));
						for (var i = 0; i < maxNews; i++) {
							var title = replaceContent(data.responseData.feed.entries[i].title);
						var content = replaceContent(data.responseData.feed.entries[i].content);
						if (title.length > 0 && content.length > 0) {
							newsHeadlines.push(formatHeadline(headlineKeywords[i] + '. ' + title + '. ' + content));
						}
						title = null;
						content = null;
						}
						// Spread the word
						for (var j = 0; j < newsHeadlines.length; j++) {
							//Homey.log(newsHeadlines[j].length);
							//Homey.log(newsHeadlines[j]);
							Homey.manager('speech-output').say(__(newsHeadlines[j]));
						}
					}
				});
			}
		});
	});
};