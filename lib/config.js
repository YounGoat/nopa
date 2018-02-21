'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

const CONFIG = {
	"npm.home" : "https://www.npmjs.com/",
	"npm.registry" : "https://registry.npmjs.org/",
};

function config(name) {
	return CONFIG[name];
}

module.exports = config;