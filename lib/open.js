'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, child_process = require('child_process')
	, os = require('os')
	
	/* NPM */
	
	/* in-package */
	;
	
module.exports = function(pathname) {
	switch (os.platform()) {
		case 'win32':
			child_process.exec('explorer "' + pathname + '"');
			return;
	
		case 'darwin':
			child_process.exec('open "' + pathname + '"');
			return;

		default:
			throw new Error(`unsupported os platform: ${os.platform()}`);
	}
};