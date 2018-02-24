'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

function builtinModules() {
	let names = Object.keys(process.binding('natives'));
	return names.filter(name => !/^_|\//.test(name));
}

module.exports = builtinModules;