/**
 * SEE
 *   Regular expression / Character classes
 *   https://en.wikipedia.org/wiki/Regular_expression#Character_classes
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, noda = require('noda')
	
	/* in-package */
	, CharSet = require('./CharSet')
	;

function genCharSet(name) {
	switch (name) {
		case 'lower'  : return new CharSet('a', 'z')
		case 'upper'  : return new CharSet('A', 'Z')
		case 'number' : return new CharSet('0', '9')
		case 'alpha'  : return new CharSet('A', 'Z').concat(new CharSet('a', 'z'))
		case 'alnum'  : return new CharSet('A', 'Z').concat(new CharSet('a', 'z'), new CharSet('0', '9'))
		case 'xdigit' : return new CharSet(['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f']).concat(new CharSet('0', '9'))
	}
};
	
function Pattern(pattern) {
	let _texts = [], _charsets = [];
	
	let ret;
	while (ret = pattern.match(/\[:([a-z]+):\]/)) {
		let left = pattern.substr(0, ret.index);
		let right = pattern.substr(ret.index + ret[0].length);
		let name = ret[1];

		_charsets.push(genCharSet(name));
		_texts.push(left);
		pattern = right;
	}
	_texts.push(pattern);

	Object.assign(this, { _texts, _charsets });
}

Pattern.prototype.next = function() {
	let { _charsets, _texts } = this;
	
	let chars = [];
	for (let i = _charsets.length - 1, moved = false; i >= 0; i--) {
		let charset = _charsets[i];
		
		if (moved) {
			// Get current char of the charset.
			chars[i] = charset.next(0);
		}
		else if (charset.isTouched()) {
			if (i == 0) {
				chars = null;
				break;
			}
			
			// Reset the charset.
			chars[i] = charset.reset().next();
		}
		else {
			// Move on the charset.
			chars[i] = charset.next();
			moved = true;
		}
	}

	if (chars) {
		let output = '';
		chars.push('');
		_texts.forEach((text, i) => output += text + chars[i]);
		return output;
	}
	else {
		return null;
	}
};

module.exports = Pattern;