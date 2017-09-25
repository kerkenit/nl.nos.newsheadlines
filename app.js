/* global Homey, module */
(function() {
	'use strict';
}());
exports.init = function() {
	var striptags = require('striptags');
	var Entities = require('html-entities').AllHtmlEntities;
	entities = new Entities();
	var numberOfNewsArticles = Homey.manager('settings').get('numberOfNewsArticles');
	if (numberOfNewsArticles === undefined || numberOfNewsArticles === null) {
		Homey.manager('settings').set('numberOfNewsArticles', 5);
	}
	var newslength = Homey.manager('settings').get('newslength');
	if (newslength === undefined || newslength === null) {
		Homey.manager('settings').set('newslength', 100);
	}
	var headlineKeywords = [__('app.numbers.one'), __('app.numbers.two'), __('app.numbers.three'), __('app.numbers.four'), __('app.numbers.five'), __('app.numbers.six'), __('app.numbers.seven'), __('app.numbers.eight'), __('app.numbers.nine'), __('app.numbers.ten'), __('app.numbers.eleven'), __('app.numbers.twelve'), __('app.numbers.thirteen'), __('app.numbers.fourteen'), __('app.numbers.fiveteen'), __('app.numbers.sixteen'), __('app.numbers.seventeen'), __('app.numbers.eightteen'), __('app.numbers.nineteen'), __('app.numbers.twenty')];
	String.prototype.beautify = function() {
		return this.replace('  ', '').replace('"', '').replace("'", "").replace("\"", "").replace("-", " ").trim();
	};
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
	var formatHeadline = function(text) {
			text = text.replace('"', '');
			text = text.replace("'", "");
			text = text.replace("\"", "");
			text = striptags(text).substr(0, 255);
			var index = text.lastIndexOf('.');
			return [text.slice(0, index), text.slice(index + 1)][0] + '.';
		};
	String.prototype.replaceContent = function() {
		this.replace(__('app.findandreplace.kmph.find'), __('app.findandreplace.kmph.replace'));
		this.replace(__('app.findandreplace.mph.find'), __('app.findandreplace.mph.replace'));
		this.replace(__('app.findandreplace.co2.find'), __('app.findandreplace.co2.replace'));
		this.replace(__('app.findandreplace.rivm.find'), __('app.findandreplace.rivm.replace'));
		this.replace(__('app.findandreplace.om.find'), __('app.findandreplace.om.replace'));
		this.replace(__('app.findandreplace.rdw.find'), __('app.findandreplace.rdw.replace'));
		this.replace(__('app.findandreplace.who.find'), __('app.findandreplace.who.replace'));
		this.replace(__('app.findandreplace.wmo.find'), __('app.findandreplace.wmo.replace'));
		this.replace(__('app.findandreplace.bbc.find'), __('app.findandreplace.bbc.replace'));
		this.replace(__('app.findandreplace.youp.find'), __('app.findandreplace.youp.replace'));
		this.replace(__('app.findandreplace.nos.find'), __('app.findandreplace.nos.replace'));
		this.replace(__('app.findandreplace.taser.find'), __('app.findandreplace.taser.replace'));
		this.replace(__('app.findandreplace.is.find'), __('app.findandreplace.is.replace'));
		this.replace(__('app.findandreplace.nasa.find'), __('app.findandreplace.nasa.replace'));
		this.replace(__('app.findandreplace.elnino.find'), __('app.findandreplace.elnino.replace'));
		return this;
	};
	var createSpeechText = function(textRaw) {
			var text = [];
			//cut at last space every 255 chars
			var senetenceParts = textRaw.split(/[,.!\?\:;]+/g);
			for (var i = 0; i < senetenceParts.length; i++) {
				if (senetenceParts[i].length >= 255) {
					var textHelper = senetenceParts[i].substr(0, 255);
					var textIndexLastSpaceBefore255 = senetenceParts[i].lastIndexOf(' ');
					text.push(senetenceParts[i].substr(0, textIndexLastSpaceBefore255).beautify());
					text.push(senetenceParts[i].substr(textIndexLastSpaceBefore255, senetenceParts[i].length).beautify());
				} else {
					text.push(senetenceParts[i].beautify());
				}
			}
			return text.filter(Boolean);
		};
	var autocomplete = function(callback, args) {
			var myItems = [{
				rss: 'http://feeds.nos.nl/nosnieuwsalgemeen',
				name: 'NOS Nieuws Algemeen'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwsbinnenland',
				name: ' NOS Nieuws Binnenland '
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwsbuitenland',
				name: 'NOS Nieuws Buitenland'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwspolitiek',
				name: 'NOS Nieuws Politiek'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwseconomie',
				name: 'NOS Nieuws Economie'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwsopmerkelijk',
				name: 'NOS Nieuws Opmerkelijk'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwskoningshuis',
				name: 'NOS Nieuws Koningshuis'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwscultuurenmedia',
				name: 'NOS Nieuws Cultuur en media'
			}, {
				rss: 'http://feeds.nos.nl/nosnieuwstech',
				name: 'NOS Nieuws Tech'
			}, {
				rss: 'http://feeds.nos.nl/nossportalgemeen',
				name: 'NOS Sport Algemeen'
			}, {
				rss: 'http://feeds.nos.nl/nosvoetbal',
				name: 'NOS Sport Voetbal'
			}, {
				rss: 'http://feeds.nos.nl/nossportwielrennen',
				name: 'NOS Sport Wielrennen'
			}, {
				rss: 'http://feeds.nos.nl/nossportschaatsen',
				name: 'NOS Sport Schaatsen'
			}, {
				rss: 'http://feeds.nos.nl/nossporttennis',
				name: 'NOS Sport Tennis'
			}, {
				rss: 'http://feeds.nos.nl/nieuwsuuralgemeen',
				name: 'Nieuwsuur'
			}, {
				rss: 'http://feeds.nos.nl/nosop3',
				name: 'NOS op 3'
			}, {
				rss: 'http://feeds.nos.nl/jeugdjournaal',
				name: 'NOS Jeugdjournaal'
			}];
			// filter items to match the search query
			myItems = myItems.filter(function(item) {
				return (item.name.toLowerCase().indexOf(args.query.toLowerCase()) > -1);
			});
			callback(null, myItems); // err, results
		};
	var readNews = function(maxNews, newslength, feed, callback) {
			Homey.log('News headlines are being downloaded');
			var FeedMe = require('feedme');
			var http = require('http');
			var newsHeadlines = [];
			var Headlines = [];
			maxNews = (maxNews > 20 ? 20 : (maxNews <= 1 ? 1 : maxNews)); // Minimum of 1 article, maximum of 20 articles (~source limit)
			newsHeadlines.push(__('app.speechPrefix'));
			var i = 0;
			http.get(feed.rss, function(res) {
				var parser = new FeedMe();
				parser.on('item', function(item) {
					if (i < maxNews) {
						Homey.log(item.title);
						var title = entities.decode(item.title.beautify()).replaceContent();
						var content = striptags(entities.decode(item.description).replaceContent());
						if (title.length > 0 && content.length > 0) {
							newsHeadlines.push(formatHeadline(headlineKeywords[i] + '. ' + title + '. '));
							if (newslength === 'full') {
								var description = createSpeechText(content);
								for (var j = 0; j < description.length; j++) {
									newsHeadlines.push(description[j]);
								}
							} else if (newslength !== 'headline') {
								var words = content.split(' ', Number(newslength));
								var descriptions = words.join(' ');
								if (!descriptions.endsWith('.')) {
									descriptions = descriptions.substr(0, descriptions.lastIndexOf(".") + 1);
								}
								descriptions = createSpeechText(descriptions.substr(0, descriptions.length));
								for (var k = 0; k < descriptions.length; k++) {
									newsHeadlines.push(descriptions[k]);
								}
							}
						}
					}
					i++;
				});
				parser.on('end', function() {
					for (var j = 0; j < newsHeadlines.length; j++) {
						Homey.manager('speech-output').say(__(newsHeadlines[j]));
					}
					callback(null, true);
				});
				res.pipe(parser);
			});
		};
	Homey.manager('flow').on('action.readNews', function(callback, args) {
		readNews(args.itemcount, args.newslength, {
			rss: 'http://feeds.nos.nl/nosnieuwsalgemeen',
			name: 'NOS Nieuws Algemeen'
		}, function(obsolete, status) {
			callback('Obsolete: This card will be removed in a further release', false);
		});
	});
	Homey.manager('flow').on('action.headline.feed.autocomplete', function(callback, args) {
		autocomplete(callback, args);
	});
	Homey.manager('flow').on('action.headline', function(callback, args) {
		readNews(args.itemcount, 'headline', args.feed, callback);
	});
	Homey.manager('flow').on('action.50.feed.autocomplete', function(callback, args) {
		autocomplete(callback, args);
	});
	Homey.manager('flow').on('action.50', function(callback, args) {
		readNews(args.itemcount, '50', args.feed, callback);
	});
	Homey.manager('flow').on('action.50.feed.autocomplete', function(callback, args) {
		autocomplete(callback, args);
	});
	Homey.manager('flow').on('action.50', function(callback, args) {
		readNews(args.itemcount, '50', args.feed, callback);
	});
	Homey.manager('flow').on('action.100.feed.autocomplete', function(callback, args) {
		autocomplete(callback, args);
	});
	Homey.manager('flow').on('action.100', function(callback, args) {
		readNews(args.itemcount, '100', args.feed, callback);
	});
	Homey.manager('flow').on('action.250.feed.autocomplete', function(callback, args) {
		autocomplete(callback, args);
	});
	Homey.manager('flow').on('action.250', function(callback, args) {
		readNews(args.itemcount, '250', args.feed, callback);
	});
	Homey.manager('flow').on('action.full.feed.autocomplete', function(callback, args) {
		autocomplete(callback, args);
	});
	Homey.manager('flow').on('action.full', function(callback, args) {
		readNews(args.itemcount, 'full', args.feed, callback);
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
				var maxNews = Homey.manager('settings').get('numberOfNewsArticles')
				var newslength = Homey.manager('settings').get('newslength');
				var feed = Homey.manager('settings').get('feed');
				if (feed === undefined || feed === null || feed.length <= 7) {
					feed = 'http://feeds.nos.nl/nosnieuwsalgemeen';
				}
				readNews(maxNews, newslength, {
					rss: feed
				}, callback);
			}
		});
	});
};
