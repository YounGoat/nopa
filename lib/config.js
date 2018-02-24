'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, noda = require('noda')
	
	/* in-package */
	, CONFIG = noda.inRequire('conf')
	;

function config(name) {
	return CONFIG[name];
}

module.exports = config;