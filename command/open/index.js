'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, commandos = require('commandos')
	, if2 = require('if2')
	, noda = require('noda')
	
	/* in-package */
	, config = noda.inRequire('lib/config')
	, homepage = noda.inRequire('command/homepage')
	, profile = noda.inRequire('command/profile')
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			// No options.
		]
	];
	
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });
	const name = if2.defined(cmd.$[0], '').trim();

	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else if (!name) {
		return help();
	}
	else if (name[0] == '~') {
		profile({ user: name });
	}
	else if (name[0] == '@' && !name.includes('/')) {
		profile({ org: name });
	}
	else {
		homepage({ name, type: 'npm' });
	}
}

run.desc = 'Alias of subcommands `homepage`, `profile`.';

module.exports = run;