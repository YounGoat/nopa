'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, overload2 = require('overload2')
	
	/* in-package */
	;

const CharType = overload2.Type(s => typeof s == 'string' && s.length == 1 || typeof s == 'number');
const plCCN = new overload2.ParamList(CharType, CharType, 'number =1');

// Transform an array mixed with strings and numbers, to an array made up of only strings.
const toCharArray = arr => arr.map( char => typeof char == 'number' ? String.fromCharCode(char) : char );

const CharSet = overload2()
	.overload(
		plCCN,
		function(start, end, step) {
			if (typeof start == 'string') {
				start = start.charCodeAt(0);
			}
			if (typeof end == 'string') {
				end = end.charCodeAt(0);
			}			
			if (!step) {
				step = 1;
			}
			Object.assign(this, { 
				start, 
				end, 
				step,
				cursor: null,
			});
		}
	)
	.overload(
		'string',
		function(chars) {
			Object.assign(this, {
				chars: chars.split(''),
				cursor: null,
			})
		}
	)
	.overload(
		Array,
		function(chars) {
			Object.assign(this, {
				chars: toCharArray(chars),
				cursor: null,
			});
		}
	)
	;

CharSet.prototype.contains = function(char) {
	// Coll mode.
	if (this.chars) {
		if (typeof char == 'number') char = String.fromCharCode(char);
		return this.chars.includes(char);
	}

	// Interval mode.
	else {
		if (typeof char == 'string') char = char.charCodeAt(0);
		let 
			d  = Math.abs(this.start - this.end), 
			d1 = Math.abs(this.start - char),
			d2 = Math.abs(this.end - char);
		return d1 + d2 == d && (char - this.start) % this.step == 0;
	}
};

CharSet.prototype.next = function(offset) {
	if (arguments.length == 0) offset = 1;

	let char = null;

	// Coll mode.
	if (this.chars) {
		let cursor = 0;
		if (this.cursor != null) {
			cursor = this.cursor + offset;
		}
		if (cursor < this.chars.length) {
			char = this.chars[cursor];
			this.cursor = cursor;
		}
	}

	// Interval mode.
	else {
		let cursor = null;
		if (this.cursor != null) {
			cursor = this.cursor + this.step * offset;
		}
		else if (offset > 0) {
			cursor = this.start + this.step * (offset - 1);
		}

		if (this.contains(cursor)) {
			char = String.fromCharCode(cursor);
			this.cursor = cursor;
		}
	}
	
	return char;
};

CharSet.prototype.reset = function() {
	this.cursor = null;	
	return this;
};

CharSet.prototype.isTouched = function() {
	let touched;

	if (this.cursor === null) {
		touched = false;
	}

	// Coll mode.
	else if (this.chars) {
		touched = (this.cursor == this.chars.length - 1);
	}

	// Interval mode.
	else {
		touched = !this.contains(this.cursor + this.step);
	}

	return touched;
};

CharSet.prototype.toArray = function() {
	let chars = null;
	if (this.chars) {
		chars = this.chars.slice();
	}
	else {
		chars = [];
		for (let i = this.start; i <= this.end; i += this.step) {
			chars.push(String.fromCharCode(i));
		}
	}
	return chars;
};

CharSet.prototype.concat = overload2()
	.overload(
		[ CharSet, '+' ],
		function(css) {
			let chars = this.toArray();
			css.forEach( cs => chars = chars.concat(cs.toArray()) );
			return new CharSet(chars);
		}
	)
	.overload(
		Array,
		function(chars) {
			chars = this.toArray().concat(toCharArray(chars));
			return new CharSet(chars);
		}
	)
	.overload(
		'string',
		function(chars) {
			chars = this.toArray().concat(chars.split(''));
			return new CharSet(chars);
		}
	)
	.overload(
		'number',
		function(charcode) {
			let chars = this.toArray().concat(String.fromCharCode(charcode));
			return new CharSet(chars);
		}
	)
	.overload(
		plCCN,
		function(start, end, step) {
			let chars = this.toArray().concat(new CharSet(start, end, step).toArray());
			return new CharSet(chars);
		}
	)
	;


// var c1 = new CharSet('a', 'z');
// var c2 = new CharSet('A', 'Z');
// var c3 = new CharSet('0', '9');
// console.log(c1.concat(c2, c3).toArray());
// // console.log(c);

module.exports = CharSet;