const assert = require('assert');
const { generateSelector } = require('../content/contentScript.js');
const { generateUserScript } = require('../background.js');

console.log('Running basic tests for LLogos...');

// generateSelector tests
assert.strictEqual(
  generateSelector({ tagName: 'DIV', className: '' }),
  'div'
);

assert.strictEqual(
  generateSelector({ tagName: 'span', className: 'foo bar' }),
  'span.foo.bar'
);

// generateUserScript tests
const selectors = 'div.foo, span.bar';
const script = generateUserScript(selectors);
assert.ok(script.includes('// ==UserScript=='));
assert.ok(script.includes(`document.querySelectorAll('${selectors}')`));

console.log('All tests passed.');