
var Stachedown = require('../'),
	assert = require('assert');

describe('Stachedown', function() {
	describe('#constructor()', function() {
		it('should return an instance of Stachedown', function() {
			var sd = new Stachedown();
			assert(sd instanceof Stachedown);
		});
		it('should not require the `new` keyword', function() {
			var sd = Stachedown();
			assert(sd instanceof Stachedown);
		});
		it('should accept an Marked options hash', function() {
			var sd = Stachedown({optionsFlag: true});
			assert(sd._options.optionsFlag);
		});
	});
	describe('#setOptions()', function() {
		it('should replace current options with new options', function() {
			var previous = {previous: true},
				next = {previous: false};
			var sd = Stachedown(previous);
			assert.equal(sd._options, previous);
			sd.setOptions(next);
			assert.equal(sd._options, next);
		});
	});
	describe('#render()', function() {
		it('should be synchronous if Marked is synchronous', function(done) {
			var sd = Stachedown({highlight: function(code) {
					return code;
				}}),
				markdown = "*stachedown*",
				context = {noop: 'noop'};
			sd._renderSync = function(template, data) {
				assert.equal(template, markdown);
				assert.equal(data, context);
				done();
			}
			sd.render(markdown, context);
		});
		it('should be asynchronous if Marked is asynchronous', function(done) {
			var sd = Stachedown({highlight: function(code, lang, done) {
					return done(null, code);
				}}),
				markdown = "*stachedown*",
				context = {noop: 'noop'},
				callback = function() {};
			sd._render = function(template, data, next) {
				assert.equal(template, markdown);
				assert.equal(data, context);
				assert.equal(next, callback);
				done();
			}
			sd.render(markdown, context, callback);
		});
		it('should throw if a callback is not provided for an asynchronous render', function() {
			var sd = Stachedown({highlight: function(code, lang, done) {
					return done(null, code);
				}}),
				markdown = "*stachedown*",
				context = {noop: 'noop'};
			assert.throws(function() {
				sd.render(markdown, context);
			}, Error);
			assert.throws(function() {
				sd.render(markdown, context, null);
			}, Error);
			assert.throws(function() {
				sd.render(markdown, context, 'string');
			}, Error);
		});
	});
	describe('#renderStrict()', function() {
		describe('[sync]', function() {
			it('should throw if template variables are undefined', function() {
				var sd = Stachedown(),
					template = '*The {{type}} with {{missing}}.*',
					data = {type: 'Markdown'};
				assert.throws(function() {
					sd.renderStrict(template, data);
				});
			});
			it('should not throw if all template variables are defined', function() {
				var sdd = Stachedown(),
					template = '*The {{type}} with {{missing}}.*',
					data = {type: 'Markdown', missing: 'zero errors'};
				assert.doesNotThrow(function() {
					sdd.renderStrict(template, data);
				});
			});
		});
		describe('[async]', function() {
			it('should callback with error if template variables are undefined', function() {
				var sd = Stachedown(),
					template = '*The {{type}} with {{missing}}.*',
					data = {type: 'Markdown'};
				sd.renderStrict(template, data, function(error, html) {
					assert(error instanceof Error);
				});
			});
			it('should callback with null if all template variables are defined', function() {
				var sd = Stachedown(),
					template = '*The {{type}} with {{missing}}.*',
					data = {type: 'Markdown', missing: 'zero errors'};
				sd.renderStrict(template, data, function(error, html) {
					assert.equal(null, error);
					assert.equal('string', typeof html);
				});
			});
		});
	});
	describe('#_render()', function() {
		it('should callback with rendered HTML', function(done) {
			var sd = Stachedown(),
				template = 'The {{type}}.',
				data = {type: 'HTML'};
			sd._render(template, data, function(error, html) {
				assert.equal('string', typeof html);
				assert.equal('<p>The HTML.</p>', html.trim());
				done();
			});
		});
	});
	describe('#_renderSync()', function() {
		it('should return rendered HTML', function() {
			var sd = Stachedown(),
				template = 'The {{type}}.',
				data = {type: 'HTML'};
				html = sd._renderSync(template, data);
			assert.equal('string', typeof html);
			assert.equal('<p>The HTML.</p>', html.trim());
		});
	});
	describe('#inject()', function() {
		it('should return rendered Markdown', function() {
			var sd = Stachedown(),
				template = '*The {{type}}.*',
				data = {type: 'Markdown'},
				html = sd.inject(template, data);
			assert.equal('string', typeof html);
			assert.equal('*The Markdown.*', html.trim());
		});
	});
	describe('#injectStrict()', function() {
		it('should throw if template variables are undefined', function() {
			var sd = Stachedown(),
				template = '*The {{type}} with {{missing}}.*',
				data = {type: 'Markdown'};
			assert.throws(function() {
				sd.injectStrict(template, data);
			});
		});
		it('should not throw if all template variables are defined', function() {
			var sd = Stachedown(),
				template = '*The {{type}} with {{missing}}.*',
				data = {type: 'Markdown', missing: 'zero errors'};
			assert.doesNotThrow(function() {
				sd.injectStrict(template, data);
			});
		});
	});
	describe('#marked()', function() {
		it('should return Marked with Stachedown options set', function() {
			var sd = Stachedown({optionsFlag: true});
			assert(sd.marked().defaults.optionsFlag);
		});
	});
	describe('#markedRender()', function() {
		it('should return rendered Markdown if synchronous', function() {
			var sd = Stachedown(),
				template = '*stachedown*',
				expected = '<p><em>stachedown</em></p>',
				html = sd.markedRender(template);
			assert.equal(expected, html.trim());
		});
		it('should callback with rendered Markdown if asynchronous', function(done) {
			var sd = Stachedown({highlight: function(code, lang, done) {
					return done(null, code);
				}}),
				template = '*stachedown*',
				expected = '<p><em>stachedown</em></p>',
				callback = function(error, html) {
					assert.equal(expected, html.trim());
					done();
				};
			sd.markedRender(template, callback);
		});
	});
	describe('#markedIsAsync()', function() {
		it('should return true if Marked is asynchronous', function() {
			var sd = Stachedown({highlight: function(code, lang, next) {
				next(null, code);
			}});
			assert(sd.markedIsAsync());
		});
		it('should return false if Marked is synchronous', function() {
			var sd = Stachedown({highlight: function(code) {
				return code;
			}});
			assert(!sd.markedIsAsync());
		});
	});
	describe('.Marked', function() {
		it('should export marked', function() {
			assert(require('marked'), Stachedown.Marked);
		});
	});
	describe('.Mustache', function() {
		it('should export mustache', function() {
			assert(require('mustache'), Stachedown.Marked);
		});
	});
});
