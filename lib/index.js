
var marked = require('marked'),
	mustache = require('mustache'),
	strict = require('./strict');

module.exports = Stachedown;
module.exports.Marked = marked;
module.exports.Mustache = mustache;

function Stachedown(options) {
	if(!(this instanceof Stachedown)) return new Stachedown(options);
	this.setOptions(options);
}

Stachedown.prototype.setOptions = function(options) {
	this._options = options || {};
	this._options.highlight = this._options.highlight || null;
	return this;
}

Stachedown.prototype.render = function(template, data, next) {
	if(!this.markedIsAsync()) return this._renderSync(template, data);
	if(typeof next !== 'function') {
		throw new Error("Marked is configured to be asynchronous and thus Stachedown is as well. Please provide a callback function.");
	}
	this._render(template, data, next);
}

Stachedown.prototype.renderStrict = function(template, data, next) {
	var error = strict(template, data);
	if(error) {
		if(next) return next(error);
		throw error;
	}
	return this.render(template, data, next);
}

Stachedown.prototype._render = function(template, data, next) {
	this.markedRender(template, function(error, html) {
		if(error) return next(error);
		next(error, mustache.render(html, data));
	});
}

Stachedown.prototype._renderSync = function(template, data) {
	return mustache.render(this.markedRender(template), data);
}

Stachedown.prototype.inject = function(markdown, data) {
	return mustache.render(markdown, data);
}

Stachedown.prototype.injectStrict = function(markdown, data) {
	var error = strict(markdown, data);
	if(error) throw error;
	return this.inject(markdown, data);
}

Stachedown.prototype.marked = function() {
	return marked.setOptions(this._options);
}

Stachedown.prototype.markedRender = function(markdown, next) {
	return this.marked()(markdown, next);
}

Stachedown.prototype.markedIsAsync = function() {
	var fn = this.marked().defaults.highlight;
	return typeof fn === 'function' && fn.length > 2;
}

