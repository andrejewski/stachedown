
var mustache = require('mustache');

module.exports = strict;

function strict(template, data) {
	var parseTree = mustache.parse(template),
		variables = parseTree.filter(function(node) {
			var head = node[0];
			return head === 'name' || head === '#';
		}),
		undefineds = variables.filter(function(node) {
			var prop = node[1];
			return access(data, prop) === void 0;
		});
	if(undefineds.length === 0) return null;
	var properties = undefineds.map(function(u) {return u[1];});
	return new Error('Properties '+properties.join(', ')+' are undefined.')
}

// c/p'd from andrejewski/reem-flow
function access(obj, prop) {
	if(typeof prop !== 'string') return obj[prop];
	var sprop = prop.split('.');
	if(sprop.length === 1) return obj[prop];
	return access(obj[sprop.shift()] || {}, sprop.join('.'));
}
