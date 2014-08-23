Stachedown
==========

Stachedown helps write Mustache templates in Markdown instead of HTML.

## Installation

```bash
npm install stachedown
```

## Usage

Stachedown can be used to `render` HTML from Markdown-Mustache templates and `inject` Mustache directly into Markdown without rendering the Makrdown.

### Rendering HTML

```javascript
var Stachedown = require("stachedown"),
	stachedown = Stachedown();

var template = "{{a}} is *{{b}}*.",
	data = {a: 'Shrek', b: 'love'};

stachedown.render(template, data);
// => "<p>Shrek is <em>love</em>.</p>\n"
```

### Injecting Mustache

```javascript
var Stachedown = require("stachedown"),
	stachedown = Stachedown();

var template = "{{a}} is *{{b}}*.",
	data = {a: 'Shrek', b: 'love'};

stachedown.inject(template, data);
// => "Shrek is *love*."
```

## Configuration

Stachedown requires [mustache.js](https://github.com/janl/mustache.js) and [marked](https://github.com/chjj/marked). While it does not provided anything more than functions, Stachedown does expose the configuration options of its dependencies.

```javascript
var Stachedown = require("stachedown"),
	Marked = Stachedown.Marked,
	Mustache = Stachedown.Mustache;
```
Marked options can also be passed directly to the Stachedown constructor and will be used for each render with that Stachedown instance. [See marked for more details.](https://github.com/chjj/marked)

```javascript
var Stachedown = require("stachedown"),
	stachedown = Stachedown({marked options});
```

Since Marked can be configured to be asynchronous, Stachedown can determine whether marked is configured asynchrounsly and adapt to match an asynchronous call.

```javascript
stachedown.render(template, data, function(error, html) {
	// Note: This only works for #render().
	// Stachedown#inject() is always synchronous.
});
```

## Strict Templating

Suppose a template is rendered with an Object literal as data using Mustache. Mustache ignores missing and undefined variables in templates.

```javascript
Mustache.render('The {{important_thing}} must be visible.', {});
// => 'The  must be visible.'
```

This output almost always is not ideal. Stachedown exposes two methods `#renderStrict()` and `#injectStrict()` to ensure variables exist when put into the template.  They have the same function signatures as their `#render()` and `#inject()` counterparts.

```javascript
stachedown.renderStrict('The {{important_thing}} must be visible.', {});
// throws Error
```

While strict templating is not a direct goal of Stachedown, I thought the use case was good enough to include it within this module.

## Contributing

Contributions are incredibly welcome as long as they are standardly applicable and pass the tests (or break bad ones). Tests are written in Mocha and assertions are done with the Node.js core `assert` module.

```bash
# running tests
npm run test
npm run test-spec # spec reporter
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.

