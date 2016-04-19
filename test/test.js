var virtualize = require('../')
  , expect = require('expect.js')
describe('vdom-virtualize', function() {
var div, input, output
beforeEach(function() {
  div = document.createElement('div')
})
it('should virtualize a tree recursively', function () {
	div.innerHTML = '<div><p>test</p></div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');

	var children = output.children;
	expect(children).to.have.length(1);
	expect(children[0].type).to.equal('VirtualNode');
	expect(children[0].tagName).to.equal('P');

	var textChildren = children[0].children;
	expect(textChildren).to.have.length(1);
	expect(textChildren[0].type).to.equal('VirtualText');
	expect(textChildren[0].text).to.equal('test');
});

it('should overtake id attribute on node', function () {
	div.innerHTML = '<div id="abc">test</div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');
	expect(output.properties.id).to.equal('abc');
});

it('should overtake class attribute on node', function () {
	div.innerHTML = '<div class="abc">test</div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');
	expect(output.properties.className).to.equal('abc');
});

it('should overtake class attribute on node when there are multiple classes', function () {
	div.innerHTML = '<div class="abc def">test</div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');
	expect(output.properties.className).to.equal('abc def');
});

it('should virtualize multiple attributes on node', function () {
	div.innerHTML = '<input tabIndex="1" name="abc" value="123">';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('INPUT');
	expect(output.properties.tabIndex).to.equal(1);
	expect(output.properties.name).to.equal('abc');
	expect(output.properties.value).to.equal('123');
});

it('should overtake style attribute on node', function () {
	div.innerHTML = '<div style="color: red;" id="abc">test</div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');
	expect(output.properties.style).to.eql({
		color: 'red'
	});
	expect(output.properties.id).to.equal('abc');
});

it('should overtake complex style attribute on node', function () {
	div.innerHTML = '<div style="color:red;width:100px;">test</div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');
	expect(output.properties.style).to.eql({
		color: 'red'
		, width: '100px'
	});
});

it('should overtake data attribute on node', function () {
	div.innerHTML = '<div data-my-attr="abc">test</div>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('DIV');
	expect(output.properties.attributes['data-my-attr']).to.equal('abc');
});

it('should overtake for attribute on label', function () {
	div.innerHTML = '<label for="abc"></label>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('LABEL');
	expect(output.properties.htmlFor).to.equal('abc');
	expect(output.properties.attributes).to.be.undefined;
});

it('should overtake empty label', function () {
	div.innerHTML = '<label></label>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('LABEL');
	expect(output.properties).to.eql({});
});

it('should virtualize script tag', function () {
	div.innerHTML = '<script>console.log("test")</script>';
	input = div.firstChild
	output = virtualize(input);

	// IE9 doesn't support innerHTML on head or html, so no polyfill
	if (window.usingPolyfillOnIE9) {
		expect(output.type).to.equal('VirtualText');
		expect(output.text).to.equal('');
		return;
	}

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('SCRIPT');

	var children = output.children;
	expect(children).to.have.length(1);
	expect(children[0].type).to.equal('VirtualText');
	expect(children[0].text).to.equal('console.log("test")');
});

it('should virtualize meta tag', function () {
	input = document.createElement('meta')
	input.name="abc"
	input.content="test"
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('META');
	expect(output.properties.name).to.equal('abc');
	expect(output.properties.content).to.equal('test');
});

it('should parse link tag', function () {
	input = document.createElement('link')
	input.rel="abc"
	input.href="http://example.com/"
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('LINK');
	expect(output.properties.rel).to.equal('abc');
	expect(output.properties.href).to.equal('http://example.com/');
});

it('should parse title tag', function () {
	input = document.createElement('title')
	input.textContent = 'test';
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('TITLE');

	var children = output.children;
	expect(children).to.have.length(1);
	expect(children[0].type).to.equal('VirtualText');
	expect(children[0].text).to.equal('test');
});

it('should virtualize svg tag', function () {
	div.innerHTML = '<svg viewBox="0 0 10 10"></svg>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('svg');
	expect(output.namespace).to.equal('http://www.w3.org/2000/svg');
	expect(output.properties.attributes.viewBox).to.equal('0 0 10 10');
});

it('should virtualize svg tag with foreign namespace', function () {
	div.innerHTML = '<svg class="icon"><use xlink:href="/icon.svg#name"></use></svg>';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('VirtualNode');
	expect(output.tagName).to.equal('svg');
	expect(output.namespace).to.equal('http://www.w3.org/2000/svg');

	var children = output.children;
	expect(children).to.have.length(1);

	var useTag = children[0];
	expect(useTag.type).to.equal('VirtualNode');
	expect(useTag.tagName).to.equal('use');
	expect(output.properties.attributes.class).to.equal('icon');

	expect(useTag.properties.attributes['xlink:href']).to.equal('/icon.svg#name');
});

it('should handle cdata with fallback', function () {
	div.innerHTML = '<![CDATA[ hey ]]>';
	input = div.firstChild
	if (!input) return // Hey IE9! We're just going to add this fail-safe to not upset you...
	output = virtualize(input);

	expect(output.type).to.equal('Widget');
});

it('should handle html comment with fallback', function () {
	div.innerHTML = '<!-- comment -->';
	input = div.firstChild
	output = virtualize(input);

	expect(output.type).to.equal('Widget');
});

})
