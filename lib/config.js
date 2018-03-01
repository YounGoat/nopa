'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, os = require('os')
	, path = require('path')
	
	/* NPM */
	, if2 = require('if2')
	, noda = require('noda')
	, JsonFile = require('jinang/JsonFile')
	
	/* in-package */
	, CONFIG = noda.inRequire('conf')
	;

let userConfig = new JsonFile(path.join(os.homedir(), '.nopa.json'));

function config(name, value) {
	if (arguments.length == 0) {
		return Object.assign({}, CONFIG, userConfig.json);
	}
	if (arguments.length == 1) {
		return if2.defined(userConfig.json[name], CONFIG[name]);
	}
	else {
		userConfig.json[name] = value;
		userConfig.save();
	}
}

config.reset = function(name) {
	if (name) {
		delete userConfig.json[name];
	}
	else {
		userConfig.json = {};
	}
	userConfig.save();
};

module.exports = config;